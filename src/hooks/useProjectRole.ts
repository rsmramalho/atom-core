// Returns the current user's role in a shared project
import { useProjectMembers } from "./useProjectMembers";
import { useCurrentUser } from "./useCurrentUser";
import type { ProjectMember } from "./useProjectMembers";

export type ProjectRoleInfo = {
  role: "owner" | "editor" | "viewer" | null;
  isViewer: boolean;
  isEditor: boolean;
  isOwner: boolean;
  isMember: boolean;
};

export function useProjectRole(projectId: string | undefined): ProjectRoleInfo {
  const user = useCurrentUser();
  const { members } = useProjectMembers(projectId);

  const member = user ? members.find((m) => m.user_id === user.id) : undefined;
  const role = member?.role ?? null;

  return {
    role,
    isViewer: role === "viewer",
    isEditor: role === "editor" || role === "owner",
    isOwner: role === "owner",
    isMember: !!member,
  };
}
