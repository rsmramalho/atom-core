// Atom Engine 4.0 - Dashboard Data Hook (B.10)
// Filters and organizes items for dashboard views

import { useMemo } from "react";
import { useAtomItems } from "./useAtomItems";
import type { AtomItem } from "@/types/atom-engine";
import {
  getCurrentRitualSlot,
  filterFocus,
  filterToday,
  splitTodayItems,
  filterRitual,
} from "@/lib/dashboard-filters";

export function useDashboardData() {
  const { items, isLoading, updateItem, refetch } = useAtomItems();

  // Active (non-completed) items only
  const activeItems = useMemo(() => {
    return items.filter(item => !item.completed);
  }, [items]);

  // filterFocus: Items with #focus tag
  const focusItems = useMemo(() => {
    return filterFocus(items);
  }, [items]);

  // filterToday: Items due today or overdue (excluding ritual items)
  const todayItems = useMemo(() => {
    return filterToday(items);
  }, [items]);

  // Split today items into overdue and today
  const { overdueItems, dueTodayItems } = useMemo(() => {
    return splitTodayItems(todayItems);
  }, [todayItems]);

  // filterRitual: Habits with matching ritual_slot for current time
  const currentSlot = getCurrentRitualSlot();
  
  const ritualItems = useMemo(() => {
    return filterRitual(items, currentSlot);
  }, [items, currentSlot]);

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
