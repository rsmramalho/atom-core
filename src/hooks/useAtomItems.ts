// Atom Engine 4.0 - useAtomItems Hook
// CRUD operations for AtomItems via Supabase
// Single Table Design - All item types in one table
// With offline support

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "./useCurrentUser";
import type { AtomItem, CreateItemPayload, UpdateItemPayload, ItemType, RitualSlot, ProjectStatus, ProgressMode, ChecklistItem } from "@/types/atom-engine";
import { useEngineLogger } from "./useEngineLogger";
import { useNetworkStatus } from "./useNetworkStatus";
import { addToQueue } from "@/lib/offline-queue";
import { saveToLocalCache, getFromLocalCache } from "@/lib/local-cache";
import type { Json, TablesInsert } from "@/integrations/supabase/types";
import type { ItemsRow, TypedItemsRow, asTypedRow, UpdatePayload } from "@/types/database";

// Helper to map database row to AtomItem
function mapRowToAtomItem(row: ItemsRow): AtomItem {
  const typed = row as unknown as TypedItemsRow;
  return {
    id: typed.id,
    user_id: typed.user_id,
    title: typed.title,
    type: typed.type,
    module: typed.module,
    tags: typed.tags || [],
    parent_id: typed.parent_id,
    project_id: typed.project_id,
    due_date: typed.due_date,
    recurrence_rule: typed.recurrence_rule,
    ritual_slot: typed.ritual_slot,
    completed: typed.completed,
    completed_at: typed.completed_at,
    completion_log: typed.completion_log || [],
    notes: typed.notes,
    checklist: typed.checklist || [],
    project_status: typed.project_status,
    progress_mode: typed.progress_mode,
    progress: typed.progress,
    deadline: typed.deadline,
    weight: typed.weight ?? 1,
    order_index: typed.order_index ?? 0,
    created_at: typed.created_at,
    updated_at: typed.updated_at,
  };
}

export function useAtomItems() {
  const queryClient = useQueryClient();
  const { addLog } = useEngineLogger();
  const { isOnline } = useNetworkStatus();

  // Get cached data for initial/offline use
  const cachedItems = getFromLocalCache<AtomItem[]>('atom-items');

  // Fetch all items for the current user
  const itemsQuery = useQuery({
    queryKey: ["atom-items"],
    queryFn: async (): Promise<AtomItem[]> => {
      // If offline, return cached data
      if (!isOnline) {
        addLog("QueryEngine", "Offline - using cached items");
        if (cachedItems) {
          return cachedItems;
        }
        throw new Error("Sem conexão e sem dados em cache");
      }

      addLog("QueryEngine", "Fetching all items");
      
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000);

      if (error) {
        addLog("QueryEngine", "Error fetching items", { error: error.message });
        // On error, try to use cached data
        if (cachedItems) {
          addLog("QueryEngine", "Using cached data due to error");
          return cachedItems;
        }
        throw error;
      }

      const items = (data || []).map(mapRowToAtomItem);
      
      // Save to local cache for offline use
      saveToLocalCache('atom-items', items);
      
      addLog("QueryEngine", `Fetched ${items.length} items`);
      return items;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    initialData: cachedItems || undefined,
    retry: isOnline ? 3 : 0, // Don't retry when offline
  });

  // Create a new item
  const createMutation = useMutation({
    mutationFn: async (payload: CreateItemPayload): Promise<AtomItem> => {
      addLog("MutationEngine", "Creating new item", { title: payload.title, type: payload.type });

      const userId = await getCurrentUserId();

      const insertData: TablesInsert<"items"> = {
        user_id: userId,
        title: payload.title,
        type: payload.type,
        module: payload.module,
        tags: payload.tags,
        parent_id: payload.parent_id,
        project_id: payload.project_id,
        due_date: payload.due_date,
        recurrence_rule: payload.recurrence_rule,
        ritual_slot: payload.ritual_slot,
        completed: payload.completed,
        completed_at: payload.completed_at,
        notes: payload.notes,
        checklist: JSON.parse(JSON.stringify(payload.checklist)) as Json,
        project_status: payload.project_status,
        progress_mode: payload.progress_mode as "auto" | "manual" | "milestone" | null,
        progress: payload.progress,
        deadline: payload.deadline,
        weight: payload.weight ?? 1,
        order_index: payload.order_index ?? 0,
      };

      // Offline support: queue operation if offline
      if (!isOnline) {
        const tempId = crypto.randomUUID();
        await addToQueue({
          type: 'insert',
          table: 'items',
          data: { ...insertData, id: tempId },
        });
        
        // Return optimistic item
        const optimisticItem: AtomItem = {
          ...mapRowToAtomItem({ 
            ...insertData, 
            id: tempId, 
            created_at: new Date().toISOString(), 
            updated_at: new Date().toISOString(),
            milestones: null,
          } as ItemsRow),
        };
        
        addLog("MutationEngine", "Item queued for offline sync", { id: tempId });
        return optimisticItem;
      }

      const { data, error } = await supabase
        .from("items")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        addLog("MutationEngine", "Error creating item", { error: error.message });
        throw error;
      }

      addLog("MutationEngine", "Item created successfully", { id: data.id });
      return mapRowToAtomItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atom-items"] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });

  // Update an existing item
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: UpdateItemPayload & { id: string }): Promise<AtomItem> => {
      addLog("MutationEngine", "Updating item", { id });

      // INTEGRITY GUARD: Prevent reflections from being marked as completed
      // Reflections are non-actionable items per Engine B.3 spec
      if (payload.completed === true && isOnline) {
        // Check if item is a reflection before allowing completion
        const { data: existingItem } = await supabase
          .from("items")
          .select("type")
          .eq("id", id)
          .single();
        
        if (existingItem?.type === "reflection") {
          addLog("MutationEngine", "BLOCKED: Attempted to complete reflection", { id });
          throw new Error("Reflections cannot be marked as completed. They are non-actionable items.");
        }
      }

      // Build update payload with proper JSON serialization
      const updateData: Record<string, unknown> = { ...payload };
      if (payload.checklist !== undefined) {
        updateData.checklist = JSON.parse(JSON.stringify(payload.checklist));
      }

      // Offline support: queue operation if offline
      if (!isOnline) {
        await addToQueue({
          type: 'update',
          table: 'items',
          data: { id, ...updateData },
        });
        
        // Return optimistic update from cache
        const cachedItems = queryClient.getQueryData<AtomItem[]>(["atom-items"]) || [];
        const existingItem = cachedItems.find(item => item.id === id);
        
        if (existingItem) {
          const optimisticItem: AtomItem = {
            ...existingItem,
            ...payload,
            updated_at: new Date().toISOString(),
          };
          
          // Optimistically update the cache
          queryClient.setQueryData<AtomItem[]>(["atom-items"], 
            cachedItems.map(item => item.id === id ? optimisticItem : item)
          );
          
          addLog("MutationEngine", "Item update queued for offline sync", { id });
          return optimisticItem;
        }
        
        throw new Error("Item not found in cache");
      }

      const { data, error } = await supabase
        .from("items")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        addLog("MutationEngine", "Error updating item", { error: error.message });
        throw error;
      }

      addLog("MutationEngine", "Item updated successfully", { id });
      return mapRowToAtomItem(data);
    },
    onSuccess: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: ["atom-items"] });
        queryClient.invalidateQueries({ queryKey: ["milestones"] });
      }
    },
  });

  // Delete an item
  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      addLog("MutationEngine", "Deleting item", { id });

      // Offline support: queue operation if offline
      if (!isOnline) {
        await addToQueue({
          type: 'delete',
          table: 'items',
          data: { id },
        });
        
        // Optimistically remove from cache
        const cachedItems = queryClient.getQueryData<AtomItem[]>(["atom-items"]) || [];
        queryClient.setQueryData<AtomItem[]>(["atom-items"], 
          cachedItems.filter(item => item.id !== id)
        );
        
        addLog("MutationEngine", "Item delete queued for offline sync", { id });
        return;
      }

      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id);

      if (error) {
        addLog("MutationEngine", "Error deleting item", { error: error.message });
        throw error;
      }

      addLog("MutationEngine", "Item deleted successfully", { id });
    },
    onSuccess: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: ["atom-items"] });
        queryClient.invalidateQueries({ queryKey: ["milestones"] });
      }
    },
  });

  return {
    items: itemsQuery.data || [],
    isLoading: itemsQuery.isLoading,
    error: itemsQuery.error,
    refetch: itemsQuery.refetch,
    createItem: createMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
