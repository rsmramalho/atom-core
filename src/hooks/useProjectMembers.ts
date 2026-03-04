// Collaboration - useProjectMembers hook
// Manages project members and invites for shared projects

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "./useCurrentUser";

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: "owner" | "editor" | "viewer";
  created_at: string;
  email?: string;
}

export interface ProjectInvite {
  id: string;
  project_id: string;
  invite_code: string;
  role: "owner" | "editor" | "viewer";
  expires_at: string;
  max_uses: number | null;
  use_count: number;
  created_at: string;
}

export function useProjectMembers(projectId: string | undefined) {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async (): Promise<ProjectMember[]> => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("project_members")
        .select("*, profiles:user_id(email)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []).map((row: any) => ({
        ...row,
        email: row.profiles?.email ?? null,
      })) as ProjectMember[];
    },
    enabled: !!projectId,
  });

  const invitesQuery = useQuery({
    queryKey: ["project-invites", projectId],
    queryFn: async (): Promise<ProjectInvite[]> => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("project_invites")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ProjectInvite[];
    },
    enabled: !!projectId,
  });

  // Ensure current user is registered as owner (idempotent)
  const ensureOwner = useMutation({
    mutationFn: async () => {
      if (!projectId) return;
      const { error } = await supabase.rpc("ensure_project_owner", {
        _project_id: projectId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
    },
  });

  // Create an invite link
  const createInvite = useMutation({
    mutationFn: async (params: { maxUses?: number; role?: "editor" | "viewer" } = {}): Promise<ProjectInvite> => {
      if (!projectId) throw new Error("No project ID");
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from("project_invites")
        .insert({
          project_id: projectId,
          created_by: userId,
          role: (params?.role || "editor") as any,
          max_uses: params?.maxUses ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as unknown as ProjectInvite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-invites", projectId] });
    },
  });

  // Remove a member
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
    },
  });

  // Delete an invite
  const deleteInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      const { error } = await supabase
        .from("project_invites")
        .delete()
        .eq("id", inviteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-invites", projectId] });
    },
  });

  // Update a member's role
  const updateMemberRole = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: "editor" | "viewer" }) => {
      const { error } = await supabase
        .from("project_members")
        .update({ role: role as any })
        .eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
    },
  });

  // Check if current user is owner
  const currentUserId = membersQuery.data?.find(m => m.role === "owner")?.user_id;

  return {
    members: membersQuery.data || [],
    invites: invitesQuery.data || [],
    isLoading: membersQuery.isLoading,
    isOwner: (userId: string) => membersQuery.data?.some(m => m.user_id === userId && m.role === "owner") ?? false,
    ensureOwner: ensureOwner.mutateAsync,
    createInvite: createInvite.mutateAsync,
    removeMember: removeMember.mutateAsync,
    deleteInvite: deleteInvite.mutateAsync,
    updateMemberRole: updateMemberRole.mutateAsync,
    isCreatingInvite: createInvite.isPending,
  };
}

// Accept an invite by code
export async function acceptProjectInvite(inviteCode: string): Promise<string> {
  const { data, error } = await supabase.rpc("accept_project_invite", {
    _invite_code: inviteCode,
  });
  if (error) throw error;
  return data as string;
}
