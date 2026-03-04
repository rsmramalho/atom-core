// Share Project Modal - Manage members and invite links
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Copy, Link2, Trash2, UserPlus, Users, Crown, Pencil, Eye, Check } from "lucide-react";
import { toast } from "sonner";
import { MemberAvatar } from "@/components/shared/MemberAvatar";

interface ShareProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle: string;
}

export function ShareProjectModal({ open, onOpenChange, projectId, projectTitle }: ShareProjectModalProps) {
  const user = useCurrentUser();
  const { members, invites, isOwner, createInvite, removeMember, deleteInvite, updateMemberRole, isCreatingInvite } = useProjectMembers(projectId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const isCurrentUserOwner = user ? isOwner(user.id) : false;

  const handleCreateInvite = async () => {
    try {
      const invite = await createInvite({ role: inviteRole });
      const url = `${window.location.origin}/invite/${invite.invite_code}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link de convite copiado!");
    } catch (error) {
      toast.error("Erro ao criar convite");
    }
  };

  const handleCopyLink = async (code: string, inviteId: string) => {
    const url = `${window.location.origin}/invite/${code}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(inviteId);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Link copiado!");
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
      toast.success("Membro removido");
    } catch (error) {
      toast.error("Erro ao remover membro");
    }
  };

  const handleRoleChange = async (memberId: string, newRole: "editor" | "viewer") => {
    try {
      await updateMemberRole({ memberId, role: newRole });
      toast.success(`Role alterado para ${newRole === "editor" ? "Editor" : "Viewer"}`);
    } catch (error) {
      toast.error("Erro ao alterar role");
    }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    try {
      await deleteInvite(inviteId);
      toast.success("Convite removido");
    } catch (error) {
      toast.error("Erro ao remover convite");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Compartilhar Projeto
          </DialogTitle>
          <DialogDescription>
            Gerencie membros de "{projectTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Members list */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Membros</h4>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Nenhum membro ainda. Crie um link de convite!</p>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <MemberAvatar email={member.email} fallback={member.user_id} />
                      {member.role === "owner" ? (
                        <Crown className="h-3.5 w-3.5 text-amber-500 -ml-1" />
                      ) : null}
                      <span className="text-sm truncate max-w-[180px]">
                        {member.user_id === user?.id ? "Você" : (member.email || member.user_id.slice(0, 8) + "...")}
                      </span>
                      {member.role === "owner" ? (
                        <Badge variant="outline" className="text-xs">Owner</Badge>
                      ) : isCurrentUserOwner ? (
                        <div className="flex rounded-md border border-input overflow-hidden text-xs">
                          <button
                            className={`px-2 py-0.5 transition-colors ${member.role === "editor" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                            onClick={() => handleRoleChange(member.id, "editor")}
                          >
                            Editor
                          </button>
                          <button
                            className={`px-2 py-0.5 transition-colors ${member.role === "viewer" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                            onClick={() => handleRoleChange(member.id, "viewer")}
                          >
                            Viewer
                          </button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {member.role === "viewer" ? "Viewer" : "Editor"}
                        </Badge>
                      )}
                    </div>
                    {isCurrentUserOwner && member.user_id !== user?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invite links */}
          {isCurrentUserOwner && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Links de Convite</h4>
                <div className="flex items-center gap-1.5">
                  <div className="flex rounded-md border border-input overflow-hidden text-xs">
                    <button
                      className={`px-2 py-1 ${inviteRole === "editor" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      onClick={() => setInviteRole("editor")}
                    >
                      Editor
                    </button>
                    <button
                      className={`px-2 py-1 ${inviteRole === "viewer" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      onClick={() => setInviteRole("viewer")}
                    >
                      Viewer
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateInvite}
                    disabled={isCreatingInvite}
                    className="gap-1.5"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Novo Link
                  </Button>
                </div>
              </div>

              {invites.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Nenhum link ativo.</p>
              ) : (
                <div className="space-y-2">
                  {invites.map((invite) => {
                    const isExpired = new Date(invite.expires_at) < new Date();
                    const isExhausted = invite.max_uses !== null && invite.use_count >= invite.max_uses;
                    
                    return (
                      <div key={invite.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 min-w-0">
                          <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-mono text-muted-foreground">
                              ...{invite.invite_code.slice(-8)}
                            </span>
                            <div className="flex gap-1 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {invite.role === "viewer" ? "Viewer" : "Editor"}
                              </Badge>
                              {isExpired && <Badge variant="destructive" className="text-xs">Expirado</Badge>}
                              {isExhausted && <Badge variant="secondary" className="text-xs">Esgotado</Badge>}
                              {!isExpired && !isExhausted && (
                                <Badge variant="outline" className="text-xs">
                                  {invite.use_count} uso{invite.use_count !== 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleCopyLink(invite.invite_code, invite.id)}
                            disabled={isExpired || isExhausted}
                          >
                            {copiedId === invite.id ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDeleteInvite(invite.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Not owner message */}
          {!isCurrentUserOwner && members.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Apenas o owner pode gerenciar membros e convites.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
