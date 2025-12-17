import { useState, memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2 } from "lucide-react";
import { ItemContextMenu, EditItemModal, DeleteConfirmDialog, ModuleBadge } from "@/components/shared";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "@/hooks/use-toast";
import type { AtomItem } from "@/types/atom-engine";

interface InboxItemCardProps {
  item: AtomItem;
  onProcess: (item: AtomItem) => void;
}

export const InboxItemCard = memo(function InboxItemCard({ item, onProcess }: InboxItemCardProps) {
  const { updateItem, deleteItem, isUpdating, isDeleting } = useAtomItems();
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter out #inbox tag for display
  const displayTags = item.tags.filter(tag => 
    tag.toLowerCase() !== "#inbox"
  );

  // Check for special tags
  const moduleTag = displayTags.find(t => t.startsWith("#mod_"));
  const moduleFromTag = moduleTag ? moduleTag.replace("#mod_", "") : null;
  const whoTags = displayTags.filter(t => t.startsWith("#who:"));
  const whereTags = displayTags.filter(t => t.startsWith("#where:"));
  const otherTags = displayTags.filter(t => 
    !t.startsWith("#mod_") && 
    !t.startsWith("#who:") && 
    !t.startsWith("#where:")
  );

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

  // Get the module to display (from field or tag)
  const displayModule = item.module || moduleFromTag;

  return (
    <>
      <Card className="p-4 bg-card card-interactive group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-medium text-foreground truncate mb-2">
              {item.title}
            </h3>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {/* Due date chip */}
              {item.due_date && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-accent/10 text-accent border-accent/30"
                >
                  📅 {new Date(item.due_date).toLocaleDateString('pt-BR')}
                </Badge>
              )}
              
              {/* Module badge */}
              {displayModule && (
                <ModuleBadge module={displayModule} />
              )}
              
              {/* Who chips */}
              {whoTags.map(tag => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  className="text-xs bg-secondary/50 text-secondary-foreground"
                >
                  {tag.replace("#who:", "👤 ")}
                </Badge>
              ))}
              
              {/* Where chips */}
              {whereTags.map(tag => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  className="text-xs bg-secondary/50 text-secondary-foreground"
                >
                  {tag.replace("#where:", "📍 ")}
                </Badge>
              ))}
              
              {/* Other tags */}
              {otherTags.map(tag => (
                <Badge 
                  key={tag}
                  variant="secondary" 
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}

              {/* Ritual slot */}
              {item.ritual_slot && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/30"
                >
                  {item.ritual_slot === "manha" && "🌅 Manhã"}
                  {item.ritual_slot === "meio_dia" && "☀️ Meio-dia"}
                  {item.ritual_slot === "noite" && "🌙 Noite"}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <ItemContextMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <Button
              onClick={() => onProcess(item)}
              variant="outline"
              size="sm"
              className="gap-2 opacity-70 group-hover:opacity-100 group-hover:border-primary group-hover:text-primary transition-all"
            >
              <Wand2 className="h-4 w-4" />
              Processar
            </Button>
          </div>
        </div>
      </Card>

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
});
