// Project Sheet - Work Area Pane (Tasks & Habits) with Tag Engine Lite (B.15) + Drag & Drop
import { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ListTodo,
  Repeat,
  Sunrise,
  Sun,
  Sunset,
  Layers,
  GripVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemContextMenu, EditItemModal, DeleteConfirmDialog } from "@/components/shared";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { AtomItem, RitualSlot } from "@/types/atom-engine";

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

// Haptic feedback utility
const hapticFeedback = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(25),
  success: () => navigator.vibrate?.([10, 50, 20]),
  heavy: () => navigator.vibrate?.(50),
};

interface WorkAreaPaneProps {
  items: AtomItem[];
  onToggle: (id: string) => void;
}

const RITUAL_ICONS: Record<RitualSlot, React.ElementType> = {
  manha: Sunrise,
  meio_dia: Sun,
  noite: Sunset,
};

// Tag Engine Lite: Check if item is a section header (checks both tags array AND title)
function isSectionHeader(item: AtomItem): boolean {
  const inTags = item.tags?.some(tag => tag.toLowerCase() === "#scope_macro") || false;
  const inTitle = item.title.toLowerCase().includes("#scope_macro");
  return inTags || inTitle;
}

// Sortable Task Item Component
function SortableTaskItem({ 
  item, 
  onToggle,
  isSection = false
}: { 
  item: AtomItem; 
  onToggle: (id: string) => void;
  isSection?: boolean;
}) {
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
  } = useSortable({ 
    id: item.id,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

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

  // Clean title for section headers
  const displayTitle = isSection 
    ? item.title.replace(/#scope_macro/gi, "").trim() 
    : item.title;

  if (isSection) {
    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            "flex items-center gap-2 py-2 px-2 mt-3 first:mt-0 rounded-lg",
            "bg-primary/10 border border-primary/20",
            "transition-all duration-200 ease-out group",
            isDragging && "opacity-40 scale-[0.98] border-primary/50 z-0"
          )}
        >
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-primary/50 hover:text-primary touch-none transition-colors"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm text-primary flex-1">
            {displayTitle}
          </span>
          
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

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted/50",
          "transition-all duration-200 ease-out group",
          isDragging && "opacity-40 scale-[0.98] border border-primary/30 bg-primary/5 z-0",
          item.completed && "opacity-60"
        )}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground touch-none transition-colors opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="h-3 w-3" />
        </button>

        {/* Toggle button */}
        <button
          onClick={() => onToggle(item.id)}
          className="flex-shrink-0 transition-transform hover:scale-110"
        >
          {item.completed ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>

        {/* Content */}
        <span className={cn(
          "truncate text-sm flex-1 text-left",
          item.completed && "line-through text-muted-foreground"
        )}>
          {displayTitle}
        </span>

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

// Drag overlay item (floating preview)
function DragOverlayItem({ item, isSection }: { item: AtomItem; isSection: boolean }) {
  const displayTitle = isSection 
    ? item.title.replace(/#scope_macro/gi, "").trim() 
    : item.title;

  if (isSection) {
    return (
      <div className="flex items-center gap-2 py-2 px-2 rounded-lg bg-primary/20 border-2 border-primary shadow-2xl scale-[1.02] rotate-[1deg]">
        <div className="p-1 text-primary cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </div>
        <Layers className="h-4 w-4 text-primary" />
        <span className="font-semibold text-sm text-primary">
          {displayTitle}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full p-2 rounded-lg bg-background shadow-2xl border-2 border-primary scale-[1.02] rotate-[1deg]">
      <div className="p-1 -ml-1 text-primary cursor-grabbing">
        <GripVertical className="h-3 w-3" />
      </div>
      <div className="flex-shrink-0">
        {item.completed ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <Circle className="h-4 w-4 text-primary" />
        )}
      </div>
      <span className="truncate text-sm">{displayTitle}</span>
    </div>
  );
}

export function WorkAreaPane({ items, onToggle }: WorkAreaPaneProps) {
  const { updateItem } = useAtomItems();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filter out milestones (type='task' but with #milestone tag) - Single Table Design
  const tasks = items.filter(i => i.type === "task" && !i.tags.includes("#milestone"));
  const habits = items.filter(i => i.type === "habit");

  // Sort tasks by order_index
  const sortedTasks = [...tasks].sort((a, b) => 
    (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  // Separate pending and completed (excluding section headers from completed count)
  const pendingTasks = sortedTasks.filter(t => !t.completed && !isSectionHeader(t));
  const completedTasks = sortedTasks.filter(t => t.completed && !isSectionHeader(t));
  const pendingTasksAndSections = sortedTasks.filter(t => !t.completed);
  
  const pendingHabits = habits.filter(h => !h.completed);
  const completedHabits = habits.filter(h => h.completed);

  const activeItem = activeId ? sortedTasks.find(item => item.id === activeId) : null;

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    hapticFeedback.medium();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = pendingTasksAndSections.findIndex((item) => item.id === active.id);
      const newIndex = pendingTasksAndSections.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(pendingTasksAndSections, oldIndex, newIndex);
      
      // Update order_index for all affected items
      try {
        await Promise.all(
          newOrder.map((item, index) =>
            updateItem({ id: item.id, order_index: index })
          )
        );
        
        hapticFeedback.success();
        toast({
          title: "Ordem atualizada",
          description: "A ordem das tasks foi salva.",
        });
      } catch {
        hapticFeedback.heavy();
        toast({
          title: "Erro ao reordenar",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Tasks Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListTodo className="h-5 w-5 text-blue-500" />
            Tasks
            <Badge variant="secondary" className="ml-auto">
              {pendingTasks.length} pendentes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma task vinculada
            </p>
          )}
          
          {/* Render sortable tasks with DnD */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={pendingTasksAndSections.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {pendingTasksAndSections.map((task) => (
                  <SortableTaskItem 
                    key={task.id} 
                    item={task} 
                    onToggle={onToggle}
                    isSection={isSectionHeader(task)}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag overlay for smooth animation */}
            <DragOverlay dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
              {activeItem ? (
                <DragOverlayItem item={activeItem} isSection={isSectionHeader(activeItem)} />
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Completed tasks section */}
          {completedTasks.length > 0 && (
            <div className="pt-2 border-t border-border/50 space-y-1 mt-3">
              <p className="text-xs text-muted-foreground">
                Completas ({completedTasks.length})
              </p>
              {completedTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onToggle(task.id)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate text-sm line-through text-muted-foreground">
                    {task.title}
                  </span>
                </button>
              ))}
            </div>
          )}
          
          {/* Hint */}
          {tasks.length > 1 && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Arraste para reorganizar
            </p>
          )}
        </CardContent>
      </Card>

      {/* Habits Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Repeat className="h-5 w-5 text-green-500" />
            Hábitos
            <Badge variant="secondary" className="ml-auto">
              {pendingHabits.length} pendentes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendingHabits.length === 0 && completedHabits.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum hábito vinculado
            </p>
          )}
          
          {pendingHabits.map((habit) => {
            const RitualIcon = habit.ritual_slot ? RITUAL_ICONS[habit.ritual_slot] : null;
            return (
              <button
                key={habit.id}
                onClick={() => onToggle(habit.id)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-sm flex-1">{habit.title}</span>
                {RitualIcon && (
                  <RitualIcon className="h-4 w-4 text-amber-500" />
                )}
              </button>
            );
          })}

          {completedHabits.length > 0 && (
            <div className="pt-2 border-t border-border/50 space-y-1">
              <p className="text-xs text-muted-foreground">
                Completos hoje ({completedHabits.length})
              </p>
              {completedHabits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => onToggle(habit.id)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate text-sm line-through text-muted-foreground">
                    {habit.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
