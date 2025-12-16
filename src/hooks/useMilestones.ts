// Atom Engine 4.0 - Milestones Hook (B.9)
// Single Table Design: Milestones are items with #milestone tag

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtomItem } from "@/types/atom-engine";

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
function mapRowToMilestone(row: any): Milestone {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    type: row.type,
    module: row.module,
    tags: row.tags || [],
    parent_id: row.parent_id,
    project_id: row.project_id,
    due_date: row.due_date,
    recurrence_rule: row.recurrence_rule,
    ritual_slot: row.ritual_slot,
    completed: row.completed,
    completed_at: row.completed_at,
    completion_log: row.completion_log || [],
    notes: row.notes,
    checklist: row.checklist || [],
    project_status: row.project_status,
    progress_mode: row.progress_mode,
    progress: row.progress,
    deadline: row.deadline,
    weight: row.weight ?? 1,
    order_index: row.order_index ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
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
