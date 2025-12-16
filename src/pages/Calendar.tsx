// Calendar Engine - Main Page (B.4)
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useCalendarItems } from "@/hooks/useCalendarItems";
import { useAtomItems } from "@/hooks/useAtomItems";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { DayDetailSheet } from "@/components/calendar/DayDetailSheet";
import { EditItemModal } from "@/components/shared/EditItemModal";
import { toast } from "sonner";
import type { AtomItem } from "@/types/atom-engine";

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingItem, setEditingItem] = useState<AtomItem | null>(null);

  const { itemsByDate, overdueItems, isLoading, refetch } = useCalendarItems(currentDate);
  const { updateItem } = useAtomItems();

  // Get items for selected date
  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedDateItems = selectedDateKey ? (itemsByDate[selectedDateKey] || []) : [];

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
    // If item has a project, navigate to project detail
    if (item.project_id) {
      navigate(`/projects/${item.project_id}`);
    } else {
      // Open edit modal
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
              Visualize seus itens projetados no tempo
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
  );
}
