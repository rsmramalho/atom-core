// Atom Engine 4.0 - useAtomItems Hook
// CRUD operations for AtomItems via Supabase
// Single Table Design - All item types in one table

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtomItem, CreateItemPayload, UpdateItemPayload, ItemType, RitualSlot, ProjectStatus, ProgressMode, ChecklistItem } from "@/types/atom-engine";
import { useEngineLogger } from "./useEngineLogger";
import type { Json } from "@/integrations/supabase/types";

// Helper to map database row to AtomItem
function mapRowToAtomItem(row: any): AtomItem {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    type: row.type as ItemType,
    module: row.module,
    tags: row.tags || [],
    parent_id: row.parent_id,
    project_id: row.project_id,
    due_date: row.due_date,
    recurrence_rule: row.recurrence_rule,
    ritual_slot: row.ritual_slot as RitualSlot,
    completed: row.completed,
    completed_at: row.completed_at,
    notes: row.notes,
    checklist: (row.checklist as ChecklistItem[]) || [],
    project_status: row.project_status as ProjectStatus | null,
    progress_mode: row.progress_mode as ProgressMode | null,
    progress: row.progress,
    deadline: row.deadline,
    weight: row.weight ?? 1,
    order_index: row.order_index ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function useAtomItems() {
  const queryClient = useQueryClient();
  const { addLog } = useEngineLogger();

  // Fetch all items for the current user
  const itemsQuery = useQuery({
    queryKey: ["atom-items"],
    queryFn: async (): Promise<AtomItem[]> => {
      addLog("QueryEngine", "Fetching all items");
      
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        addLog("QueryEngine", "Error fetching items", { error: error.message });
        throw error;
      }

      addLog("QueryEngine", `Fetched ${data?.length || 0} items`);
      return (data || []).map(mapRowToAtomItem);
    },
  });

  // Create a new item
  const createMutation = useMutation({
    mutationFn: async (payload: CreateItemPayload): Promise<AtomItem> => {
      addLog("MutationEngine", "Creating new item", { title: payload.title, type: payload.type });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const insertData = {
        user_id: user.id,
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
        progress_mode: payload.progress_mode,
        progress: payload.progress,
        deadline: payload.deadline,
        weight: payload.weight ?? 1,
        order_index: payload.order_index ?? 0,
      };

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

      // Build update payload with proper JSON serialization
      const updateData: Record<string, any> = { ...payload };
      if (payload.checklist !== undefined) {
        updateData.checklist = JSON.parse(JSON.stringify(payload.checklist));
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
      queryClient.invalidateQueries({ queryKey: ["atom-items"] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });

  // Delete an item
  const deleteMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      addLog("MutationEngine", "Deleting item", { id });

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
      queryClient.invalidateQueries({ queryKey: ["atom-items"] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
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
