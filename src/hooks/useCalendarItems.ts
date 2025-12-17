// Calendar Engine - Hook for fetching calendar items (B.4) with Recurrence Support
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtomItem } from "@/types/atom-engine";
import type { ItemsRow } from "@/types/database";
import { startOfMonth, endOfMonth, format, isBefore, startOfDay, subMonths, addMonths } from "date-fns";
import { generateRecurrenceInstances, type RecurrenceInstance } from "@/lib/recurrence-engine";

function mapRowToItem(row: ItemsRow): AtomItem {
  const typed = row as unknown as import("@/types/database").TypedItemsRow;
  return {
    id: typed.id,
    user_id: typed.user_id,
    title: typed.title,
    type: typed.type,
    module: typed.module,
    tags: typed.tags || [],
    parent_id: typed.parent_id,
    project_id: typed.project_id,
    due_date: typed.due_date,
    recurrence_rule: typed.recurrence_rule,
    ritual_slot: typed.ritual_slot,
    completed: typed.completed,
    completed_at: typed.completed_at,
    completion_log: typed.completion_log || [],
    notes: typed.notes,
    checklist: typed.checklist || [],
    project_status: typed.project_status,
    progress_mode: typed.progress_mode,
    progress: typed.progress,
    deadline: typed.deadline,
    weight: typed.weight ?? 1,
    order_index: typed.order_index ?? 0,
    created_at: typed.created_at,
    updated_at: typed.updated_at,
  };
}

// Extended item with virtual instance info
export interface CalendarItemWithInstance extends AtomItem {
  isVirtualInstance?: boolean;
  instanceDate?: string;
  parentItemId?: string;
}

export function useCalendarItems(currentDate: Date) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Fetch items with due_date in the current month range
  const itemsQuery = useQuery({
    queryKey: ["calendar-items", format(monthStart, "yyyy-MM")],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get items with due_date
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .not("due_date", "is", null)
        .gte("due_date", format(monthStart, "yyyy-MM-dd"))
        .lte("due_date", format(monthEnd, "yyyy-MM-dd"))
        .order("due_date", { ascending: true });

      if (error) throw error;
      return (data || []).map(mapRowToItem);
    },
  });

  // Fetch all recurrent items (for generating virtual instances)
  const recurrentItemsQuery = useQuery({
    queryKey: ["recurrent-items"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .not("recurrence_rule", "is", null)
        .eq("completed", false);

      if (error) throw error;
      return (data || []).map(mapRowToItem);
    },
  });

  // Fetch overdue items (due_date < today AND not completed)
  const overdueQuery = useQuery({
    queryKey: ["calendar-overdue"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = format(startOfDay(new Date()), "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", false)
        .not("due_date", "is", null)
        .lt("due_date", today)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return (data || []).map(mapRowToItem);
    },
  });

  // Generate virtual instances from recurrent items
  const virtualInstances = useMemo((): RecurrenceInstance[] => {
    const recurrentItems = recurrentItemsQuery.data || [];
    if (recurrentItems.length === 0) return [];

    // Generate instances for an extended range (to catch all possible instances)
    const rangeStart = subMonths(monthStart, 1);
    const rangeEnd = addMonths(monthEnd, 1);
    
    return generateRecurrenceInstances(recurrentItems, rangeStart, rangeEnd);
  }, [recurrentItemsQuery.data, monthStart, monthEnd]);

  // Convert virtual instances to calendar items
  const virtualItems = useMemo((): CalendarItemWithInstance[] => {
    return virtualInstances.map((instance) => ({
      ...instance.item,
      id: `${instance.item.id}_${instance.instanceDate}`, // Unique ID for each instance
      due_date: instance.instanceDate,
      isVirtualInstance: true,
      instanceDate: instance.instanceDate,
      parentItemId: instance.item.id,
      completed: instance.isCompleted,
    }));
  }, [virtualInstances]);

  // INTEGRITY: Filter out milestones from general calendar view
  // Milestones should only appear in project-specific timeline/views
  const operationalItems = useMemo((): CalendarItemWithInstance[] => {
    const regularItems = (itemsQuery.data || []).filter(item => 
      !item.tags?.some(tag => tag.toLowerCase() === "#milestone") &&
      !item.recurrence_rule // Exclude parent recurrent items (they show as virtual instances)
    );
    
    // Filter virtual items for current month only
    const monthVirtualItems = virtualItems.filter(item => {
      if (!item.due_date) return false;
      return item.due_date >= format(monthStart, "yyyy-MM-dd") && 
             item.due_date <= format(monthEnd, "yyyy-MM-dd");
    });

    return [...regularItems, ...monthVirtualItems];
  }, [itemsQuery.data, virtualItems, monthStart, monthEnd]);

  // INTEGRITY: Filter milestones from overdue items too
  const operationalOverdueItems = useMemo((): CalendarItemWithInstance[] => {
    return (overdueQuery.data || []).filter(item => 
      !item.tags?.some(tag => tag.toLowerCase() === "#milestone") &&
      !item.recurrence_rule
    );
  }, [overdueQuery.data]);

  // Group items by date (excluding milestones)
  const itemsByDate = useMemo(() => {
    return operationalItems.reduce((acc, item) => {
      if (item.due_date) {
        const dateKey = item.due_date;
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
      }
      return acc;
    }, {} as Record<string, CalendarItemWithInstance[]>);
  }, [operationalItems]);

  return {
    items: operationalItems,
    itemsByDate,
    overdueItems: operationalOverdueItems,
    isLoading: itemsQuery.isLoading || overdueQuery.isLoading || recurrentItemsQuery.isLoading,
    error: itemsQuery.error || overdueQuery.error || recurrentItemsQuery.error,
    refetch: () => {
      itemsQuery.refetch();
      overdueQuery.refetch();
      recurrentItemsQuery.refetch();
    },
  };
}

// Helper to check if item is a milestone
export function isMilestone(item: AtomItem): boolean {
  return item.tags?.includes("#milestone") || false;
}

// Helper to check if item is overdue
export function isOverdue(item: AtomItem): boolean {
  if (!item.due_date || item.completed) return false;
  return isBefore(new Date(item.due_date), startOfDay(new Date()));
}
