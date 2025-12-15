import { useState } from "react";
import { Target, CheckCircle2, Circle, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemContextMenu, EditItemModal, DeleteConfirmDialog } from "@/components/shared";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { AtomItem } from "@/types/atom-engine";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FocusBlockProps {
  items: AtomItem[];
  onToggle: (id: string) => void;
  onReorder?: (items: AtomItem[]) => void;
}

interface SortableItemProps {
  item: AtomItem;
  onToggle: (id: string) => void;
}

function SortableItem({ item, onToggle }: SortableItemProps) {
  const { updateItem, deleteItem, isUpdating, isDeleting } = useAtomItems();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => setEditModalOpen(true);
  const handleDelete = () => setDeleteDialogOpen(true);

  const handleSaveEdit = async (updates: Partial<AtomItem>) => {
    try {
      await updateItem({ id: item.id, ...updates });
      setEditModalOpen(false);
      toast({ title: "Item atualizado" });
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(item.id);
      setDeleteDialogOpen(false);
      toast({ title: "Item excluído" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center gap-2 w-full p-3 rounded-lg bg-background/50 hover:bg-background transition-colors group",
          isDragging && "opacity-50 shadow-lg ring-2 ring-primary"
        )}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Toggle button */}
        <button
          onClick={() => onToggle(item.id)}
          className="flex-shrink-0"
        >
          {item.completed ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-primary hover:text-primary/80 transition-colors" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 text-left">
          <p className={cn(
            "font-medium truncate",
            item.completed && "line-through text-muted-foreground"
          )}>
            {item.title}
          </p>
          {item.due_date && (
            <p className="text-xs text-muted-foreground">
              {new Date(item.due_date).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>

        {/* Context menu */}
        <ItemContextMenu onEdit={handleEdit} onDelete={handleDelete} />
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

export function FocusBlock({ items, onToggle, onReorder }: FocusBlockProps) {
  const { updateItem } = useAtomItems();
  
  // Sort by order_index (items without order_index go to end)
  const sortedItems = [...items].sort((a, b) => {
    const orderA = (a as any).order_index ?? Infinity;
    const orderB = (b as any).order_index ?? Infinity;
    return orderA - orderB;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedItems.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(sortedItems, oldIndex, newIndex);
      
      // Update order_index for all affected items
      try {
        await Promise.all(
          newOrder.map((item, index) =>
            updateItem({ id: item.id, order_index: index } as any)
          )
        );
        
        onReorder?.(newOrder);
        toast({
          title: "Ordem atualizada",
          description: "A prioridade dos itens foi salva.",
        });
      } catch {
        toast({
          title: "Erro ao reordenar",
          variant: "destructive",
        });
      }
    }
  };

  if (items.length === 0) return null;

  return (
    <Card className="border-primary bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Foco
          <Badge variant="secondary" className="ml-auto">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sortedItems.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        {/* Hint */}
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Arraste para reordenar prioridades
        </p>
      </CardContent>
    </Card>
  );
}
