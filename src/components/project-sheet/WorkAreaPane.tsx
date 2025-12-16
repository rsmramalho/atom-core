// Project Sheet - Work Area Pane (Tasks & Habits) with Tag Engine Lite (B.15) + Drag & Drop
import { useState, forwardRef } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ListTodo,
  Repeat,
  Sunrise,
  Sun,
  Sunset,
  Layers,
  GripVertical,
  ArrowRightLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemContextMenu, EditItemModal, DeleteConfirmDialog } from "@/components/shared";
import { StreakBadge } from "@/components/shared/StreakBadge";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { AtomItem, RitualSlot, ItemType } from "@/types/atom-engine";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  DragOverEvent,
  useDroppable,
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
  isSection = false,
  isRecentlyConverted = false
}: { 
  item: AtomItem; 
  onToggle: (id: string) => void;
  isSection?: boolean;
  isRecentlyConverted?: boolean;
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
          item.completed && "opacity-60",
          isRecentlyConverted && "animate-[pulse_0.5s_ease-in-out] ring-2 ring-primary/50 bg-primary/10"
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

// Drag overlay item (floating preview) - uses forwardRef to avoid React warning
const DragOverlayItem = forwardRef<HTMLDivElement, { item: AtomItem; isSection: boolean }>(
  ({ item, isSection }, ref) => {
    const displayTitle = isSection 
      ? item.title.replace(/#scope_macro/gi, "").trim() 
      : item.title;

    if (isSection) {
      return (
        <div ref={ref} className="flex items-center gap-2 py-2 px-2 rounded-lg bg-primary/20 border-2 border-primary shadow-2xl scale-[1.02] rotate-[1deg]">
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
      <div ref={ref} className="flex items-center gap-2 w-full p-2 rounded-lg bg-background shadow-2xl border-2 border-primary scale-[1.02] rotate-[1deg]">
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
);

DragOverlayItem.displayName = "DragOverlayItem";

// Droppable Section wrapper
function DroppableSection({ 
  id, 
  children, 
  isOver,
  className 
}: { 
  id: string; 
  children: React.ReactNode; 
  isOver: boolean;
  className?: string;
}) {
  const { setNodeRef } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef} 
      className={cn(
        "min-h-[60px] rounded-lg transition-all duration-200",
        isOver && "bg-primary/10 ring-2 ring-primary/30 ring-dashed",
        className
      )}
    >
      {children}
    </div>
  );
}

// Sortable Habit Item Component
function SortableHabitItem({ 
  item, 
  onToggle,
  isRecentlyConverted = false
}: { 
  item: AtomItem; 
  onToggle: (id: string) => void;
  isRecentlyConverted?: boolean;
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
      toast({ title: "Hábito atualizado" });
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(item.id);
      setDeleteDialogOpen(false);
      toast({ title: "Hábito excluído" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleRitualSlotChange = async (slot: RitualSlot | null) => {
    try {
      await updateItem({ id: item.id, ritual_slot: slot });
      const slotNames: Record<string, string> = {
        manha: "Manhã",
        meio_dia: "Meio-dia",
        noite: "Noite"
      };
      toast({ 
        title: slot ? `Período: ${slotNames[slot]}` : "Período removido",
        description: `"${item.title}" atualizado.`
      });
    } catch {
      toast({ title: "Erro ao atualizar período", variant: "destructive" });
    }
  };

  const RitualIcon = item.ritual_slot ? RITUAL_ICONS[item.ritual_slot] : null;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center gap-2 w-full p-2 rounded-lg hover:bg-muted/50",
          "transition-all duration-200 ease-out group",
          isDragging && "opacity-40 scale-[0.98] border border-green-500/30 bg-green-500/5 z-0",
          item.completed && "opacity-60",
          isRecentlyConverted && "animate-[pulse_0.5s_ease-in-out] ring-2 ring-green-500/50 bg-green-500/10"
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
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground hover:text-green-500 transition-colors" />
          )}
        </button>

        {/* Content */}
        <span className={cn(
          "truncate text-sm flex-1 text-left",
          item.completed && "line-through text-muted-foreground"
        )}>
          {item.title}
        </span>

        {/* Ritual slot badge */}
        {item.ritual_slot && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs px-1.5 py-0.5 flex items-center gap-1 shrink-0",
              item.ritual_slot === "manha" && "bg-amber-500/10 border-amber-500/30 text-amber-600",
              item.ritual_slot === "meio_dia" && "bg-yellow-500/10 border-yellow-500/30 text-yellow-600",
              item.ritual_slot === "noite" && "bg-purple-500/10 border-purple-500/30 text-purple-600"
            )}
          >
            {RitualIcon && <RitualIcon className="h-3 w-3" />}
            <span className="hidden sm:inline">
              {item.ritual_slot === "manha" && "Manhã"}
              {item.ritual_slot === "meio_dia" && "Meio-dia"}
              {item.ritual_slot === "noite" && "Noite"}
            </span>
          </Badge>
        )}

        {/* Streak badge */}
        {item.completion_log && item.completion_log.length > 0 && (
          <StreakBadge completionLog={item.completion_log} compact />
        )}

        {/* Context menu */}
        <ItemContextMenu 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          isHabit
          onRitualSlotChange={handleRitualSlotChange}
          currentRitualSlot={item.ritual_slot}
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

export function WorkAreaPane({ items, onToggle }: WorkAreaPaneProps) {
  const { updateItem } = useAtomItems();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overSection, setOverSection] = useState<string | null>(null);
  const [pendingConversion, setPendingConversion] = useState<{
    item: AtomItem;
    targetType: ItemType;
  } | null>(null);
  const [selectedRitualSlot, setSelectedRitualSlot] = useState<RitualSlot | null>(null);
  const [recentlyConvertedId, setRecentlyConvertedId] = useState<string | null>(null);

  // Filter out milestones (type='task' but with #milestone tag) - Single Table Design
  const tasks = items.filter(i => i.type === "task" && !i.tags.includes("#milestone"));
  const habits = items.filter(i => i.type === "habit");

  // Sort by order_index
  const sortedTasks = [...tasks].sort((a, b) => 
    (a.order_index ?? 0) - (b.order_index ?? 0)
  );
  const sortedHabits = [...habits].sort((a, b) => 
    (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  // Separate pending and completed
  const pendingTasks = sortedTasks.filter(t => !t.completed && !isSectionHeader(t));
  const completedTasks = sortedTasks.filter(t => t.completed && !isSectionHeader(t));
  const pendingTasksAndSections = sortedTasks.filter(t => !t.completed);
  
  const pendingHabits = sortedHabits.filter(h => !h.completed);
  const completedHabits = sortedHabits.filter(h => h.completed);

  // Find active item from either list
  const activeItem = activeId 
    ? [...sortedTasks, ...sortedHabits].find(item => item.id === activeId) 
    : null;

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

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      // Check if over a droppable section
      if (over.id === "tasks-section" || over.id === "habits-section") {
        setOverSection(over.id as string);
      } else {
        // Check which section the item belongs to
        const isTask = pendingTasksAndSections.some(t => t.id === over.id);
        const isHabit = pendingHabits.some(h => h.id === over.id);
        setOverSection(isTask ? "tasks-section" : isHabit ? "habits-section" : null);
      }
    } else {
      setOverSection(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverSection(null);

    if (!over) return;

    const activeItemData = [...pendingTasksAndSections, ...pendingHabits].find(
      item => item.id === active.id
    );
    if (!activeItemData) return;

    const isActiveTask = activeItemData.type === "task";
    const isActiveHabit = activeItemData.type === "habit";

    // Check if dropped on a different section (type conversion)
    const droppedOnTasksSection = over.id === "tasks-section" || 
      pendingTasksAndSections.some(t => t.id === over.id);
    const droppedOnHabitsSection = over.id === "habits-section" || 
      pendingHabits.some(h => h.id === over.id);

    // Handle cross-section conversion - show confirmation dialog
    if (isActiveHabit && droppedOnTasksSection) {
      setPendingConversion({ item: activeItemData, targetType: "task" });
      return;
    }

    if (isActiveTask && droppedOnHabitsSection && !isSectionHeader(activeItemData)) {
      setPendingConversion({ item: activeItemData, targetType: "habit" });
      return;
    }

    // Handle reordering within same section
    if (active.id !== over.id) {
      if (isActiveTask && droppedOnTasksSection) {
        const oldIndex = pendingTasksAndSections.findIndex((item) => item.id === active.id);
        const newIndex = pendingTasksAndSections.findIndex((item) => item.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(pendingTasksAndSections, oldIndex, newIndex);
          
          try {
            await Promise.all(
              newOrder.map((item, index) =>
                updateItem({ id: item.id, order_index: index })
              )
            );
            hapticFeedback.success();
            toast({ title: "Ordem atualizada" });
          } catch {
            hapticFeedback.heavy();
            toast({ title: "Erro ao reordenar", variant: "destructive" });
          }
        }
      } else if (isActiveHabit && droppedOnHabitsSection) {
        const oldIndex = pendingHabits.findIndex((item) => item.id === active.id);
        const newIndex = pendingHabits.findIndex((item) => item.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(pendingHabits, oldIndex, newIndex);
          
          try {
            await Promise.all(
              newOrder.map((item, index) =>
                updateItem({ id: item.id, order_index: index })
              )
            );
            hapticFeedback.success();
            toast({ title: "Ordem atualizada" });
          } catch {
            hapticFeedback.heavy();
            toast({ title: "Erro ao reordenar", variant: "destructive" });
          }
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverSection(null);
  };

  const handleConfirmConversion = async () => {
    if (!pendingConversion) return;
    
    const { item, targetType } = pendingConversion;
    const isToHabit = targetType === "habit";
    
    try {
      await updateItem({ 
        id: item.id, 
        type: targetType,
        ...(isToHabit && selectedRitualSlot ? { ritual_slot: selectedRitualSlot } : {})
      });
      hapticFeedback.success();
      
      // Show animation on converted item
      setRecentlyConvertedId(item.id);
      setTimeout(() => setRecentlyConvertedId(null), 1500);
      
      toast({
        title: isToHabit ? "Convertido para Hábito" : "Convertido para Task",
        description: `"${item.title}" agora é ${isToHabit ? "um hábito" : "uma task"}.`,
      });
    } catch {
      hapticFeedback.heavy();
      toast({ title: "Erro ao converter", variant: "destructive" });
    } finally {
      setPendingConversion(null);
      setSelectedRitualSlot(null);
    }
  };

  const handleCloseConversionDialog = (open: boolean) => {
    if (!open) {
      setPendingConversion(null);
      setSelectedRitualSlot(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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
            <DroppableSection 
              id="tasks-section" 
              isOver={overSection === "tasks-section"}
            >
              {tasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Arraste um hábito aqui para converter
                </p>
              )}
              
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
                      isRecentlyConverted={task.id === recentlyConvertedId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableSection>

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
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Arraste entre seções para converter tipo
            </p>
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
            <DroppableSection 
              id="habits-section" 
              isOver={overSection === "habits-section"}
            >
              {pendingHabits.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Arraste uma task aqui para converter
                </p>
              )}
              
              <SortableContext
                items={pendingHabits.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {pendingHabits.map((habit) => (
                    <SortableHabitItem 
                      key={habit.id} 
                      item={habit} 
                      onToggle={onToggle}
                      isRecentlyConverted={habit.id === recentlyConvertedId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableSection>

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
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
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

      {/* Drag overlay for smooth animation */}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeItem ? (
          <DragOverlayItem 
            item={activeItem} 
            isSection={isSectionHeader(activeItem)} 
          />
        ) : null}
      </DragOverlay>

      {/* Conversion confirmation dialog */}
      <AlertDialog open={!!pendingConversion} onOpenChange={handleCloseConversionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Converter Item
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {pendingConversion && (
                  <p>
                    Deseja converter <strong>"{pendingConversion.item.title}"</strong> de{" "}
                    <strong>{pendingConversion.item.type === "task" ? "Task" : "Hábito"}</strong> para{" "}
                    <strong>{pendingConversion.targetType === "task" ? "Task" : "Hábito"}</strong>?
                  </p>
                )}
                
                {/* Ritual slot selector - only show when converting to habit */}
                {pendingConversion?.targetType === "habit" && (
                  <div className="space-y-2 pt-2">
                    <p className="text-sm font-medium text-foreground">
                      Período do ritual (opcional):
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRitualSlot(selectedRitualSlot === "manha" ? null : "manha")}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors",
                          selectedRitualSlot === "manha" 
                            ? "bg-amber-500/20 border-amber-500 text-amber-600" 
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <Sunrise className="h-4 w-4" />
                        Manhã
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRitualSlot(selectedRitualSlot === "meio_dia" ? null : "meio_dia")}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors",
                          selectedRitualSlot === "meio_dia" 
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-600" 
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <Sun className="h-4 w-4" />
                        Meio-dia
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRitualSlot(selectedRitualSlot === "noite" ? null : "noite")}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors",
                          selectedRitualSlot === "noite" 
                            ? "bg-purple-500/20 border-purple-500 text-purple-600" 
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <Sunset className="h-4 w-4" />
                        Noite
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmConversion}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndContext>
  );
}
