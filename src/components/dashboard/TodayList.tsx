import { useState } from "react";
import { CalendarDays, AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemContextMenu, EditItemModal, DeleteConfirmDialog } from "@/components/shared";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "@/hooks/use-toast";
import type { AtomItem } from "@/types/atom-engine";

interface TodayListProps {
  overdueItems: AtomItem[];
  dueTodayItems: AtomItem[];
  onToggle: (id: string) => void;
}

function TaskItem({ item, onToggle, isOverdue = false }: { 
  item: AtomItem; 
  onToggle: (id: string) => void;
  isOverdue?: boolean;
}) {
  const { updateItem, deleteItem, isUpdating, isDeleting } = useAtomItems();
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async (updates: Partial<AtomItem>) => {
    try {
      await updateItem({ id: item.id, ...updates });
      setEditModalOpen(false);
      toast({
        title: "Item atualizado",
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

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(item.id);
      setDeleteDialogOpen(false);
      toast({
        title: "Item excluído",
        description: `"${item.title}" foi removido.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div
        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors group ${
          isOverdue 
            ? "bg-destructive/10 hover:bg-destructive/20" 
            : "bg-muted/30 hover:bg-muted/50"
        }`}
      >
        <button onClick={() => onToggle(item.id)} className="flex-shrink-0">
          {item.completed ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className={`h-5 w-5 ${isOverdue ? "text-destructive" : "text-muted-foreground"} hover:text-primary transition-colors`} />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`truncate ${item.completed ? "line-through text-muted-foreground" : ""}`}>
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {item.due_date && (
              <span className={`text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                {new Date(item.due_date).toLocaleDateString("pt-BR")}
              </span>
            )}
            {item.module && (
              <Badge variant="outline" className="text-xs py-0">
                {item.module}
              </Badge>
            )}
          </div>
        </div>
        <ItemContextMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <EditItemModal
        item={item}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveEdit}
        isLoading={isUpdating}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={item.title}
        isLoading={isDeleting}
      />
    </>
  );
}

export function TodayList({ overdueItems, dueTodayItems, onToggle }: TodayListProps) {
  const hasItems = overdueItems.length > 0 || dueTodayItems.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="h-5 w-5 text-primary" />
          Hoje
          {hasItems && (
            <Badge variant="secondary" className="ml-auto">
              {overdueItems.length + dueTodayItems.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overdue Section */}
        {overdueItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Atrasados ({overdueItems.length})
            </div>
            <div className="space-y-2">
              {overdueItems.map((item) => (
                <TaskItem key={item.id} item={item} onToggle={onToggle} isOverdue />
              ))}
            </div>
          </div>
        )}

        {/* Today Section */}
        {dueTodayItems.length > 0 && (
          <div className="space-y-2">
            {overdueItems.length > 0 && (
              <div className="text-sm font-medium text-muted-foreground">
                Para Hoje ({dueTodayItems.length})
              </div>
            )}
            <div className="space-y-2">
              {dueTodayItems.map((item) => (
                <TaskItem key={item.id} item={item} onToggle={onToggle} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasItems && (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhuma tarefa para hoje</p>
            <p className="text-sm">Adicione itens com @hoje no Inbox</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
