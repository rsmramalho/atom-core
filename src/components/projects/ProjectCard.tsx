import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, ChevronRight, Pause, CheckCircle2, Archive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ItemContextMenu, EditItemModal, DeleteConfirmDialog, ModuleBadge } from "@/components/shared";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { AtomItem, ProjectStatus } from "@/types/atom-engine";

interface ProjectCardProps {
  project: AtomItem & {
    calculatedProgress: number;
    totalItems: number;
    completedItems: number;
  };
}

// Status visual config
const STATUS_BADGE_CONFIG: Record<ProjectStatus, { label: string; icon: React.ReactNode; className: string } | null> = {
  draft: null,
  active: null,
  paused: {
    label: "Pausado",
    icon: <Pause className="h-3 w-3" />,
    className: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  },
  completed: {
    label: "Concluído",
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  },
  archived: {
    label: "Arquivado",
    icon: <Archive className="h-3 w-3" />,
    className: "bg-slate-500/20 text-slate-500 border-slate-500/30",
  },
};

export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const { updateItem, deleteItem, items, isUpdating, isDeleting } = useAtomItems();
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Count children items
  const childItems = items.filter(i => i.project_id === project.id);
  const childCount = childItems.length;

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleArchive = async () => {
    try {
      await updateItem({
        id: project.id,
        project_status: "archived",
      });
      toast({
        title: "Projeto arquivado",
        description: `"${project.title}" foi arquivado.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível arquivar o projeto.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async (updates: Partial<AtomItem>) => {
    try {
      await updateItem({ id: project.id, ...updates });
      setEditModalOpen(false);
      toast({
        title: "Projeto atualizado",
        description: "As alterações foram salvas.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async (deleteChildren?: boolean) => {
    try {
      if (deleteChildren) {
        // Delete all children first
        for (const child of childItems) {
          await deleteItem(child.id);
        }
      } else {
        // Archive children (remove project_id and add to inbox)
        for (const child of childItems) {
          await updateItem({
            id: child.id,
            project_id: null,
            tags: [...child.tags.filter(t => t !== "#inbox"), "#inbox"],
          });
        }
      }
      
      // Delete the project
      await deleteItem(project.id);
      setDeleteDialogOpen(false);
      toast({
        title: "Projeto excluído",
        description: deleteChildren 
          ? "O projeto e todos os itens foram excluídos."
          : "O projeto foi excluído e os itens movidos para o Inbox.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
    }
  };

  const status = project.project_status || "active";
  const statusConfig = STATUS_BADGE_CONFIG[status];
  const isPaused = status === "paused";
  const isInactive = status === "paused" || status === "archived";

  return (
    <>
      <Card 
        className={cn(
          "cursor-pointer hover:border-primary/50 transition-all group",
          isPaused && "opacity-60 border-amber-500/30 bg-amber-500/5",
          status === "archived" && "opacity-50 border-slate-500/30 bg-slate-500/5",
          status === "completed" && "border-blue-500/30 bg-blue-500/5"
        )}
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <FolderKanban className={cn(
                "h-5 w-5",
                status === "completed" ? "text-blue-500" : "text-primary"
              )} />
              <h3 className="font-semibold">{project.title}</h3>
            </div>
            <div className="flex items-center gap-1">
              <ItemContextMenu
                onEdit={handleEdit}
                onDelete={handleDelete}
                onArchive={handleArchive}
                isProject
              />
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Module Badge + Status Badge */}
          <div className="mb-3 flex items-center gap-2">
            <ModuleBadge module={project.module} />
            {statusConfig && (
              <Badge variant="outline" className={cn("text-xs gap-1", statusConfig.className)}>
                {statusConfig.icon}
                {statusConfig.label}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{project.calculatedProgress}%</span>
            </div>
            <Progress value={project.calculatedProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {project.completedItems} de {project.totalItems} itens completos
            </p>
          </div>
        </CardContent>
      </Card>

      <EditItemModal
        item={project}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveEdit}
        isLoading={isUpdating}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={project.title}
        isProject
        childCount={childCount}
        isLoading={isDeleting}
      />
    </>
  );
});
