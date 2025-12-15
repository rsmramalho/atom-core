// Atom Engine 4.0 - Milestones Hook (B.9)
// CRUD operations for project milestones

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Milestone {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  completed: boolean;
  completed_at: string | null;
  weight: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateMilestonePayload = {
  project_id: string;
  title: string;
  weight?: number;
  due_date?: string | null;
};

export type UpdateMilestonePayload = {
  id: string;
  title?: string;
  completed?: boolean;
  completed_at?: string | null;
  weight?: number;
  due_date?: string | null;
};

export function useMilestones(projectId?: string) {
  const queryClient = useQueryClient();

  // Fetch milestones for a project
  const milestonesQuery = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Milestone[];
    },
    enabled: !!projectId,
  });

  // Create milestone
  const createMutation = useMutation({
    mutationFn: async (payload: CreateMilestonePayload) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("project_milestones")
        .insert({
          ...payload,
          user_id: user.id,
          weight: payload.weight || 3, // Default weight for milestones = 3x
        })
        .select()
        .single();

      if (error) throw error;
      return data as Milestone;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });

  // Update milestone
  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateMilestonePayload) => {
      const { id, ...updates } = payload;
      
      const { data, error } = await supabase
        .from("project_milestones")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Milestone;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });

  // Delete milestone
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("project_milestones")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
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
