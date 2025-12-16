// Calendar Engine - Main Page (B.4) with Drag & Drop
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
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
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useCalendarItems } from "@/hooks/useCalendarItems";
import { useAtomItems } from "@/hooks/useAtomItems";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { DayDetailSheet } from "@/components/calendar/DayDetailSheet";
import { CalendarItem } from "@/components/calendar/CalendarItem";
import { EditItemModal } from "@/components/shared/EditItemModal";
import { toast } from "sonner";
import type { AtomItem } from "@/types/atom-engine";

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingItem, setEditingItem] = useState<AtomItem | null>(null);
  const [activeItem, setActiveItem] = useState<AtomItem | null>(null);

  const { itemsByDate, overdueItems, isLoading, refetch } = useCalendarItems(currentDate);
  const { updateItem } = useAtomItems();

  // Configure sensors for drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get items for selected date
  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedDateItems = selectedDateKey ? (itemsByDate[selectedDateKey] || []) : [];

  // Find item by ID across all dates
  const findItemById = useCallback((id: string): AtomItem | null => {
    for (const items of Object.values(itemsByDate)) {
      const found = items.find((item) => item.id === id);
      if (found) return found;
    }
    // Also check overdue items
    return overdueItems.find((item) => item.id === id) || null;
  }, [itemsByDate, overdueItems]);

  // Toggle item completion
  const handleToggle = useCallback(async (item: AtomItem) => {
    try {
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
  }, [updateItem, refetch]);

  // Click on item to edit
  const handleItemClick = useCallback((item: AtomItem) => {
    if (item.project_id) {
      navigate(`/projects/${item.project_id}`);
    } else {
      setEditingItem(item);
    }
  }, [navigate]);

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

    // Only reschedule if dropping on a different date
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
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6">
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
        </header>

        {/* Calendar Grid */}
        <CalendarGrid
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          itemsByDate={itemsByDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Day Detail Sheet */}
        <DayDetailSheet
          date={selectedDate}
          items={selectedDateItems}
          overdueItems={overdueItems}
          onClose={() => setSelectedDate(null)}
          onToggle={handleToggle}
          onClick={handleItemClick}
        />

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
