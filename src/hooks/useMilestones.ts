// Atom Engine 4.0 - Milestones Hook (B.9)
// Single Table Design: Milestones are items with #milestone tag

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtomItem } from "@/types/atom-engine";
import type { ItemsRow } from "@/types/database";

// Milestone is an AtomItem with #milestone tag
export type Milestone = AtomItem;

export type CreateMilestonePayload = {
  project_id: string;
  title: string;
  weight?: number;
  due_date?: string | null;
  module?: string | null;
};

export type UpdateMilestonePayload = {
  id: string;
  title?: string;
  completed?: boolean;
  completed_at?: string | null;
  weight?: number;
  due_date?: string | null;
};

// Map database row to AtomItem
function mapRowToMilestone(row: ItemsRow): Milestone {
  const typed = row as unknown as import("@/types/database").TypedItemsRow;
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

export function useMilestones(projectId?: string) {
  const queryClient = useQueryClient();

  // Fetch milestones for a project (items with #milestone tag)
  const milestonesQuery = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("project_id", projectId)
        .contains("tags", ["#milestone"])
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data || []).map(mapRowToMilestone);
    },
    enabled: !!projectId,
  });

  // Create milestone (creates an item with #milestone tag)
  const createMutation = useMutation({
    mutationFn: async (payload: CreateMilestonePayload) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("items")
        .insert({
          title: payload.title,
          type: "task",
          project_id: payload.project_id,
          user_id: user.id,
          tags: ["#milestone"],
          weight: payload.weight ?? 3, // Default weight for milestones = 3x
          due_date: payload.due_date || null,
          module: payload.module || null, // Inherit module from project
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return mapRowToMilestone(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["atom-items"] });
    },
  });

  // Update milestone
  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateMilestonePayload) => {
      const { id, ...updates } = payload;
      
      const { data, error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return mapRowToMilestone(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["atom-items"] });
    },
  });

  // Delete milestone
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["atom-items"] });
    },
  });

  // Toggle milestone completion
  const toggleComplete = async (milestone: Milestone) => {
    await updateMutation.mutateAsync({
      id: milestone.id,
      completed: !milestone.completed,
      completed_at: !milestone.completed ? new Date().toISOString() : null,
    });
  };

  return {
    milestones: milestonesQuery.data || [],
    isLoading: milestonesQuery.isLoading,
    error: milestonesQuery.error,
    
    createMilestone: createMutation.mutateAsync,
    updateMilestone: updateMutation.mutateAsync,
    deleteMilestone: deleteMutation.mutateAsync,
    toggleComplete,
    
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
