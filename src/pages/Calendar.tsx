// Calendar Engine - Main Page (B.4) with Drag & Drop, Filters, and View Modes
import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addMonths, subMonths, addWeeks, subWeeks } from "date-fns";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarItems, isMilestone, type CalendarItemWithInstance } from "@/hooks/useCalendarItems";
import { useSwipe } from "@/hooks/useSwipe";
import { useAtomItems } from "@/hooks/useAtomItems";
import { useRecurrence } from "@/hooks/useRecurrence";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { WeekGrid } from "@/components/calendar/WeekGrid";
import { CalendarFilters, ItemTypeFilter, ModuleFilter, FilterCounts } from "@/components/calendar/CalendarFilters";
import { CalendarViewToggle, CalendarViewMode } from "@/components/calendar/CalendarViewToggle";
import { DayDetailSheet } from "@/components/calendar/DayDetailSheet";
import { CalendarItem } from "@/components/calendar/CalendarItem";
import { EditItemModal } from "@/components/shared/EditItemModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { AtomItem } from "@/types/atom-engine";

// Filter items based on type and module
function filterItems(
  items: CalendarItemWithInstance[],
  typeFilter: ItemTypeFilter,
  moduleFilter: ModuleFilter
): CalendarItemWithInstance[] {
  return items.filter((item) => {
    // Type filter
    if (typeFilter !== "all") {
      if (typeFilter === "milestone") {
        if (!isMilestone(item)) return false;
      } else if (typeFilter === "task") {
        if (item.type !== "task" || isMilestone(item)) return false;
      } else if (typeFilter === "habit") {
        if (item.type !== "habit") return false;
      }
    }

    // Module filter
    if (moduleFilter !== "all") {
      const itemModule = item.module?.toLowerCase() || "geral";
      if (itemModule !== moduleFilter) return false;
    }

    return true;
  });
}

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingItem, setEditingItem] = useState<AtomItem | null>(null);
  const [activeItem, setActiveItem] = useState<AtomItem | null>(null);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // View mode with localStorage persistence
  const [viewMode, setViewMode] = useState<CalendarViewMode>(() => {
    const saved = localStorage.getItem("calendar-view-mode");
    return (saved as CalendarViewMode) || "month";
  });

  // Filter state with localStorage persistence
  const [typeFilter, setTypeFilter] = useState<ItemTypeFilter>(() => {
    const saved = localStorage.getItem("calendar-type-filter");
    return (saved as ItemTypeFilter) || "all";
  });
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>(() => {
    const saved = localStorage.getItem("calendar-module-filter");
    return (saved as ModuleFilter) || "all";
  });

  // Persist view mode
  const handleViewChange = useCallback((view: CalendarViewMode) => {
    setViewMode(view);
    localStorage.setItem("calendar-view-mode", view);
  }, []);

  // Navigate with animation
  const navigateWithAnimation = useCallback((direction: "left" | "right", newDate: Date) => {
    if (isAnimating) return;
    setSlideDirection(direction);
    setIsAnimating(true);
    
    // After animation starts, change the date
    setTimeout(() => {
      setCurrentDate(newDate);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 200);
  }, [isAnimating]);

  // Keyboard shortcuts for view toggle and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // View toggle shortcuts
      if (e.key.toLowerCase() === "m" && !e.metaKey && !e.ctrlKey) {
        handleViewChange("month");
      } else if (e.key.toLowerCase() === "w" && !e.metaKey && !e.ctrlKey) {
        handleViewChange("week");
      }
      
      // Arrow navigation (← → for previous/next)
      if (e.key === "ArrowLeft" && !e.metaKey && !e.ctrlKey) {
        const newDate = viewMode === "month" ? subMonths(currentDate, 1) : subWeeks(currentDate, 1);
        navigateWithAnimation("right", newDate);
      } else if (e.key === "ArrowRight" && !e.metaKey && !e.ctrlKey) {
        const newDate = viewMode === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, 1);
        navigateWithAnimation("left", newDate);
      }
      
      // Today shortcut (T)
      if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey) {
        setCurrentDate(new Date());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleViewChange, viewMode, currentDate, navigateWithAnimation]);

  // Swipe handlers for mobile navigation
  const { handlers: swipeHandlers, swipeState } = useSwipe({
    onSwipeLeft: () => {
      const newDate = viewMode === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, 1);
      navigateWithAnimation("left", newDate);
    },
    onSwipeRight: () => {
      const newDate = viewMode === "month" ? subMonths(currentDate, 1) : subWeeks(currentDate, 1);
      navigateWithAnimation("right", newDate);
    },
    threshold: 50,
  });
  const handleTypeChange = useCallback((type: ItemTypeFilter) => {
    setTypeFilter(type);
    localStorage.setItem("calendar-type-filter", type);
  }, []);

  const handleModuleChange = useCallback((module: ModuleFilter) => {
    setModuleFilter(module);
    localStorage.setItem("calendar-module-filter", module);
  }, []);

  const { itemsByDate, overdueItems, isLoading, refetch } = useCalendarItems(currentDate);
  const { updateItem, items: allAtomItems } = useAtomItems();
  const { toggleInstanceCompletion } = useRecurrence({ items: allAtomItems });

  // Get all items flat for counting
  const allItems = useMemo(() => {
    const items: CalendarItemWithInstance[] = [];
    for (const dateItems of Object.values(itemsByDate)) {
      items.push(...dateItems);
    }
    items.push(...overdueItems);
    return items;
  }, [itemsByDate, overdueItems]);

  // Calculate filter counts
  const filterCounts = useMemo((): FilterCounts => {
    const types: Record<ItemTypeFilter, number> = { all: 0, task: 0, habit: 0, milestone: 0 };
    const modules: Record<ModuleFilter, number> = { all: 0, work: 0, body: 0, mind: 0, family: 0, geral: 0 };

    for (const item of allItems) {
      types.all++;
      
      // Type counts
      if (isMilestone(item)) {
        types.milestone++;
      } else if (item.type === "task") {
        types.task++;
      } else if (item.type === "habit") {
        types.habit++;
      }

      // Module counts
      modules.all++;
      const mod = (item.module?.toLowerCase() || "geral") as ModuleFilter;
      if (mod in modules) {
        modules[mod]++;
      } else {
        modules.geral++;
      }
    }

    return { types, modules };
  }, [allItems]);

  // Apply filters to itemsByDate
  const filteredItemsByDate = useMemo(() => {
    const filtered: Record<string, CalendarItemWithInstance[]> = {};
    for (const [date, items] of Object.entries(itemsByDate)) {
      const filteredItems = filterItems(items, typeFilter, moduleFilter);
      if (filteredItems.length > 0) {
        filtered[date] = filteredItems;
      }
    }
    return filtered;
  }, [itemsByDate, typeFilter, moduleFilter]);

  // Apply filters to overdue items
  const filteredOverdueItems = useMemo(() => {
    return filterItems(overdueItems, typeFilter, moduleFilter);
  }, [overdueItems, typeFilter, moduleFilter]);

  // Configure sensors for drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get items for selected date (filtered)
  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedDateItems = selectedDateKey ? (filteredItemsByDate[selectedDateKey] || []) : [];

  // Find item by ID across all dates (unfiltered for drag)
  const findItemById = useCallback((id: string): CalendarItemWithInstance | null => {
    for (const items of Object.values(itemsByDate)) {
      const found = items.find((item) => item.id === id);
      if (found) return found;
    }
    return overdueItems.find((item) => item.id === id) || null;
  }, [itemsByDate, overdueItems]);

  // Toggle item completion (handles both regular items and recurrence instances)
  const handleToggle = useCallback(async (item: CalendarItemWithInstance, instanceDate?: string) => {
    try {
      // If it's a virtual instance, toggle completion in the log
      if (item.isVirtualInstance && item.parentItemId && instanceDate) {
        const success = await toggleInstanceCompletion(item.parentItemId, instanceDate);
        if (success) {
          refetch();
        }
        return;
      }

      // Regular item toggle
      await updateItem({
        id: item.id,
        completed: !item.completed,
        completed_at: !item.completed ? new Date().toISOString() : null,
      });
      toast.success(item.completed ? "Item reaberto" : "Item concluído!");
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar item");
    }
  }, [updateItem, toggleInstanceCompletion, refetch]);

  // Click on item to edit (navigate for project items, or open edit for regular items)
  const handleItemClick = useCallback((item: CalendarItemWithInstance) => {
    // For virtual instances, navigate to parent project if exists
    if (item.isVirtualInstance && item.project_id) {
      navigate(`/projects/${item.project_id}`);
    } else if (item.project_id) {
      navigate(`/projects/${item.project_id}`);
    } else {
      // Open edit modal - but for virtual instances, edit the parent item
      const itemToEdit = item.isVirtualInstance && item.parentItemId 
        ? allAtomItems.find(i => i.id === item.parentItemId) || item
        : item;
      setEditingItem(itemToEdit);
    }
  }, [navigate, allAtomItems]);

  // Save edited item
  const handleSaveItem = useCallback(async (updates: Partial<AtomItem>) => {
    if (!editingItem) return;
    try {
      await updateItem({
        id: editingItem.id,
        ...updates,
      });
      toast.success("Item atualizado!");
      setEditingItem(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar item");
    }
  }, [editingItem, updateItem, refetch]);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = findItemById(active.id as string);
    setActiveItem(item);
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const itemId = active.id as string;
    const newDateKey = over.id as string;
    const item = findItemById(itemId);

    if (item && item.due_date !== newDateKey) {
      try {
        await updateItem({
          id: itemId,
          due_date: newDateKey,
        });
        toast.success("Item reagendado!");
        refetch();
      } catch (error) {
        toast.error("Erro ao reagendar item");
      }
    }
  }, [findItemById, updateItem, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Calendário</h1>
                <p className="text-sm text-muted-foreground">
                  Arraste itens para reagendar
                </p>
              </div>
            </div>
            <CalendarViewToggle view={viewMode} onViewChange={handleViewChange} />
          </div>
        </header>

        {/* Filters */}
        <CalendarFilters
          typeFilter={typeFilter}
          moduleFilter={moduleFilter}
          onTypeChange={handleTypeChange}
          onModuleChange={handleModuleChange}
          counts={filterCounts}
        />

        {/* Calendar View with Swipe Support */}
        <div
          {...swipeHandlers}
          className="touch-pan-y relative"
        >
          {/* Swipe feedback indicators */}
          {swipeState.isSwiping && swipeState.direction === "left" && (
            <div className="absolute inset-y-0 right-0 w-16 flex items-center justify-center bg-gradient-to-l from-primary/20 to-transparent z-10 pointer-events-none animate-fade-in">
              <ChevronRight className="h-8 w-8 text-primary animate-pulse" />
            </div>
          )}
          {swipeState.isSwiping && swipeState.direction === "right" && (
            <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center bg-gradient-to-r from-primary/20 to-transparent z-10 pointer-events-none animate-fade-in">
              <ChevronLeft className="h-8 w-8 text-primary animate-pulse" />
            </div>
          )}
          
        <div 
            className={cn(
              "transition-all duration-200 ease-out",
              slideDirection === "left" && "animate-slide-out-left",
              slideDirection === "right" && "animate-slide-out-right",
              !slideDirection && "animate-slide-in"
            )}
          >
            {viewMode === "month" ? (
              <CalendarGrid
                currentDate={currentDate}
                onDateChange={(date) => {
                  const isNext = date > currentDate;
                  navigateWithAnimation(isNext ? "left" : "right", date);
                }}
                itemsByDate={filteredItemsByDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            ) : (
              <WeekGrid
                currentDate={currentDate}
                onDateChange={(date) => {
                  const isNext = date > currentDate;
                  navigateWithAnimation(isNext ? "left" : "right", date);
                }}
                itemsByDate={filteredItemsByDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onToggle={handleToggle}
                onClick={handleItemClick}
              />
            )}
          </div>
        </div>

        {/* Day Detail Sheet - only for month view */}
        {viewMode === "month" && (
          <DayDetailSheet
            date={selectedDate}
            items={selectedDateItems}
            overdueItems={filteredOverdueItems}
            onClose={() => setSelectedDate(null)}
            onToggle={handleToggle}
            onClick={handleItemClick}
          />
        )}

        {/* Edit Modal */}
        {editingItem && (
          <EditItemModal
            open={!!editingItem}
            onOpenChange={(open) => !open && setEditingItem(null)}
            item={editingItem}
            onSave={handleSaveItem}
          />
        )}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeItem && (
          <div className="bg-card border border-primary rounded-lg shadow-lg p-2 opacity-90 max-w-48">
            <CalendarItem
              item={activeItem}
              onToggle={() => {}}
              onClick={() => {}}
              compact
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
