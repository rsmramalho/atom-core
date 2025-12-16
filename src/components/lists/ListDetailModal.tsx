// List Engine - List Detail Modal
// Full editing experience with drag & drop reordering

import { useState, forwardRef } from "react";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Copy, 
  MoreHorizontal,
  GripVertical,
  ListChecks,
  Sparkles,
  Palette
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "sonner";
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
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Predefined color options for lists
export const LIST_COLORS = [
  { id: "default", name: "Padrão", bg: "bg-card", border: "border-border", accent: "bg-primary" },
  { id: "red", name: "Vermelho", bg: "bg-red-500/10", border: "border-red-500/30", accent: "bg-red-500" },
  { id: "orange", name: "Laranja", bg: "bg-orange-500/10", border: "border-orange-500/30", accent: "bg-orange-500" },
  { id: "amber", name: "Âmbar", bg: "bg-amber-500/10", border: "border-amber-500/30", accent: "bg-amber-500" },
  { id: "yellow", name: "Amarelo", bg: "bg-yellow-500/10", border: "border-yellow-500/30", accent: "bg-yellow-500" },
  { id: "lime", name: "Lima", bg: "bg-lime-500/10", border: "border-lime-500/30", accent: "bg-lime-500" },
  { id: "green", name: "Verde", bg: "bg-green-500/10", border: "border-green-500/30", accent: "bg-green-500" },
  { id: "emerald", name: "Esmeralda", bg: "bg-emerald-500/10", border: "border-emerald-500/30", accent: "bg-emerald-500" },
  { id: "teal", name: "Turquesa", bg: "bg-teal-500/10", border: "border-teal-500/30", accent: "bg-teal-500" },
  { id: "cyan", name: "Ciano", bg: "bg-cyan-500/10", border: "border-cyan-500/30", accent: "bg-cyan-500" },
  { id: "sky", name: "Céu", bg: "bg-sky-500/10", border: "border-sky-500/30", accent: "bg-sky-500" },
  { id: "blue", name: "Azul", bg: "bg-blue-500/10", border: "border-blue-500/30", accent: "bg-blue-500" },
  { id: "indigo", name: "Índigo", bg: "bg-indigo-500/10", border: "border-indigo-500/30", accent: "bg-indigo-500" },
  { id: "violet", name: "Violeta", bg: "bg-violet-500/10", border: "border-violet-500/30", accent: "bg-violet-500" },
  { id: "purple", name: "Roxo", bg: "bg-purple-500/10", border: "border-purple-500/30", accent: "bg-purple-500" },
  { id: "fuchsia", name: "Fúcsia", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/30", accent: "bg-fuchsia-500" },
  { id: "pink", name: "Rosa", bg: "bg-pink-500/10", border: "border-pink-500/30", accent: "bg-pink-500" },
  { id: "rose", name: "Rosado", bg: "bg-rose-500/10", border: "border-rose-500/30", accent: "bg-rose-500" },
];

export function getListColor(tags: string[]) {
  const colorTag = tags.find(t => t.startsWith("color:"));
  const colorId = colorTag ? colorTag.replace("color:", "") : "default";
  return LIST_COLORS.find(c => c.id === colorId) || LIST_COLORS[0];
}

interface ListDetailModalProps {
  list: AtomItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClearCompleted: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

// Sortable list item component
function SortableListItem({ 
  item, 
  onToggle, 
  onDelete 
}: { 
  item: AtomItem; 
  onToggle: () => void; 
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg group hover:bg-muted/50 transition-all",
        isDragging && "opacity-40 scale-[0.98] bg-primary/5 z-0",
        item.completed && "opacity-60"
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none transition-colors opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="shrink-0 transition-transform hover:scale-110"
      >
        {item.completed ? (
          <CheckSquare className="h-5 w-5 text-primary" />
        ) : (
          <Square className="h-5 w-5 text-muted-foreground hover:text-primary" />
        )}
      </button>

      {/* Title */}
      <span className={cn(
        "flex-1 text-sm",
        item.completed && "line-through text-muted-foreground"
      )}>
        {item.title}
      </span>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

// Drag overlay item
const DragOverlayItem = forwardRef<HTMLDivElement, { item: AtomItem }>(
  ({ item }, ref) => (
    <div 
      ref={ref} 
      className="flex items-center gap-2 p-2 rounded-lg bg-background shadow-xl border-2 border-primary scale-[1.02] rotate-[1deg]"
    >
      <div className="p-1 text-primary cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="shrink-0">
        {item.completed ? (
          <CheckSquare className="h-5 w-5 text-primary" />
        ) : (
          <Square className="h-5 w-5 text-primary" />
        )}
      </div>
      <span className="flex-1 text-sm">{item.title}</span>
    </div>
  )
);
DragOverlayItem.displayName = "DragOverlayItem";

export function ListDetailModal({
  list,
  open,
  onOpenChange,
  onClearCompleted,
  onDuplicate,
  onDelete,
}: ListDetailModalProps) {
  const { items, createItem, updateItem, deleteItem } = useAtomItems();
  const [newItemText, setNewItemText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Get children of this list, sorted by order_index
  const listItems = items
    .filter(item => item.parent_id === list.id)
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const pendingItems = listItems.filter(i => !i.completed);
  const completedItems = listItems.filter(i => i.completed);
  const activeItem = activeId ? listItems.find(i => i.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    
    setIsAdding(true);
    try {
      await createItem({
        title: newItemText.trim(),
        type: "task",
        module: null,
        tags: [],
        parent_id: list.id,
        project_id: null,
        due_date: null,
        recurrence_rule: null,
        ritual_slot: null,
        completed: false,
        completed_at: null,
        notes: null,
        checklist: [],
        project_status: null,
        progress_mode: null,
        progress: null,
        deadline: null,
        weight: 1,
        order_index: listItems.length,
      });
      setNewItemText("");
    } catch (error) {
      toast.error("Erro ao adicionar item");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleItem = async (itemId: string) => {
    const item = listItems.find(i => i.id === itemId);
    if (!item) return;

    try {
      await updateItem({
        id: itemId,
        completed: !item.completed,
        completed_at: !item.completed ? new Date().toISOString() : null,
      });
    } catch (error) {
      toast.error("Erro ao atualizar item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
    } catch (error) {
      toast.error("Erro ao excluir item");
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    navigator.vibrate?.(15);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = pendingItems.findIndex(i => i.id === active.id);
    const newIndex = pendingItems.findIndex(i => i.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(pendingItems, oldIndex, newIndex);

    try {
      await Promise.all(
        newOrder.map((item, index) =>
          updateItem({ id: item.id, order_index: index })
        )
      );
      navigator.vibrate?.([10, 50, 20]);
    } catch (error) {
      toast.error("Erro ao reordenar");
    }
  };

  const completedCount = completedItems.length;
  const totalCount = listItems.length;

  const currentColor = getListColor(list.tags);

  const handleColorChange = async (colorId: string) => {
    const newTags = list.tags.filter(t => !t.startsWith("color:"));
    if (colorId !== "default") {
      newTags.push(`color:${colorId}`);
    }
    try {
      await updateItem({ id: list.id, tags: newTags });
    } catch (error) {
      toast.error("Erro ao alterar cor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", currentColor.accent)} />
              {list.title}
            </DialogTitle>
            <div className="flex items-center gap-1">
              {/* Color Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="end">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Cor da lista</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {LIST_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => handleColorChange(color.id)}
                        className={cn(
                          "w-6 h-6 rounded-full transition-all hover:scale-110",
                          color.accent,
                          currentColor.id === color.id && "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                        )}
                        title={color.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border z-50">
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar lista
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={onClearCompleted}
                    disabled={completedCount === 0}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Limpar concluídos ({completedCount})
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir lista
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {completedCount} de {totalCount} concluídos
            </p>
          )}
        </DialogHeader>

        {/* Quick add input */}
        <div className="flex items-center gap-2 py-2 flex-shrink-0">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Adicionar item..."
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            disabled={isAdding}
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={handleAddItem} 
            disabled={!newItemText.trim() || isAdding}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Items list */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          {listItems.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Lista vazia. Adicione itens acima.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-1">
                {/* Pending items (draggable) */}
                <SortableContext
                  items={pendingItems.map(i => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {pendingItems.map((item) => (
                    <SortableListItem
                      key={item.id}
                      item={item}
                      onToggle={() => handleToggleItem(item.id)}
                      onDelete={() => handleDeleteItem(item.id)}
                    />
                  ))}
                </SortableContext>

                {/* Completed items (not draggable, at bottom) */}
                {completedItems.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2 px-2">
                      Concluídos ({completedItems.length})
                    </p>
                    {completedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 rounded-lg group hover:bg-muted/50 transition-all opacity-60"
                      >
                        <div className="w-6" /> {/* Spacer for alignment */}
                        <button
                          onClick={() => handleToggleItem(item.id)}
                          className="shrink-0 transition-transform hover:scale-110"
                        >
                          <CheckSquare className="h-5 w-5 text-primary" />
                        </button>
                        <span className="flex-1 text-sm line-through text-muted-foreground">
                          {item.title}
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drag overlay */}
              <DragOverlay dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
              }}>
                {activeItem ? <DragOverlayItem item={activeItem} /> : null}
              </DragOverlay>
            </DndContext>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
