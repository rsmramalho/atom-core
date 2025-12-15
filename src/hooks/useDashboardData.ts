// Atom Engine 4.0 - Dashboard Data Hook (B.10)
// Filters and organizes items for dashboard views

import { useMemo } from "react";
import { useAtomItems } from "./useAtomItems";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import type { AtomItem, RitualSlot } from "@/types/atom-engine";

// Get current ritual slot based on time of day
function getCurrentRitualSlot(): RitualSlot {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "manha";
  if (hour >= 12 && hour < 18) return "meio_dia";
  return "noite";
}

export function useDashboardData() {
  const { items, isLoading, updateItem, refetch } = useAtomItems();

  // Active (non-completed) items only
  const activeItems = useMemo(() => {
    return items.filter(item => !item.completed);
  }, [items]);

  // filterFocus: Items with #focus tag
  const focusItems = useMemo(() => {
    return activeItems.filter(item => 
      item.tags.some(tag => tag.toLowerCase() === "#focus")
    );
  }, [activeItems]);

  // filterToday: Items due today or overdue (excluding ritual items)
  const todayItems = useMemo(() => {
    const today = startOfDay(new Date());
    
    return activeItems.filter(item => {
      // Exclude items with ritual_slot (they go to ritual section)
      if (item.ritual_slot) return false;
      // Exclude projects
      if (item.type === "project") return false;
      // Must have a due_date
      if (!item.due_date) return false;
      
      const dueDate = startOfDay(new Date(item.due_date));
      // Include if due today or overdue
      return isToday(dueDate) || isBefore(dueDate, today);
    });
  }, [activeItems]);

  // Split today items into overdue and today
  const { overdueItems, dueTodayItems } = useMemo(() => {
    const today = startOfDay(new Date());
    const overdue: AtomItem[] = [];
    const dueToday: AtomItem[] = [];

    todayItems.forEach(item => {
      if (!item.due_date) return;
      const dueDate = startOfDay(new Date(item.due_date));
      if (isBefore(dueDate, today)) {
        overdue.push(item);
      } else {
        dueToday.push(item);
      }
    });

    return { overdueItems: overdue, dueTodayItems: dueToday };
  }, [todayItems]);

  // filterRitual: Habits with matching ritual_slot for current time
  const currentSlot = getCurrentRitualSlot();
  
  const ritualItems = useMemo(() => {
    return activeItems.filter(item => 
      item.type === "habit" && item.ritual_slot === currentSlot
    );
  }, [activeItems, currentSlot]);

  // filterProjects: Active projects with progress calculation
  const projects = useMemo(() => {
    return items
      .filter(item => item.type === "project" && item.project_status === "active")
      .map(project => {
        // Find all items belonging to this project
        const projectItems = items.filter(i => i.project_id === project.id);
        const totalItems = projectItems.length;
        const completedItems = projectItems.filter(i => i.completed).length;
        
        const progress = totalItems > 0 
          ? Math.round((completedItems / totalItems) * 100) 
          : 0;

        return {
          ...project,
          calculatedProgress: progress,
          totalItems,
          completedItems,
        };
      });
  }, [items]);

  // Get items for a specific project
  const getProjectItems = (projectId: string) => {
    return items.filter(item => item.project_id === projectId);
  };

  // Toggle item completion
  const toggleComplete = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    await updateItem({
      id: itemId,
      completed: !item.completed,
      completed_at: !item.completed ? new Date().toISOString() : null,
    });
  };

  return {
    // Raw data
    items,
    activeItems,
    isLoading,
    refetch,
    
    // Filtered views
    focusItems,
    todayItems,
    overdueItems,
    dueTodayItems,
    ritualItems,
    projects,
    currentSlot,
    
    // Actions
    getProjectItems,
    toggleComplete,
  };
}
