// Calendar Engine - Hook for fetching calendar items (B.4)
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtomItem } from "@/types/atom-engine";
import { startOfMonth, endOfMonth, format, isBefore, startOfDay } from "date-fns";

function mapRowToItem(row: any): AtomItem {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    type: row.type,
    module: row.module,
    tags: row.tags || [],
    parent_id: row.parent_id,
    project_id: row.project_id,
    due_date: row.due_date,
    recurrence_rule: row.recurrence_rule,
    ritual_slot: row.ritual_slot,
    completed: row.completed,
    completed_at: row.completed_at,
    notes: row.notes,
    checklist: row.checklist || [],
    project_status: row.project_status,
    progress_mode: row.progress_mode,
    progress: row.progress,
    deadline: row.deadline,
    weight: row.weight ?? 1,
    order_index: row.order_index ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
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

  // INTEGRITY: Filter out milestones from general calendar view
  // Milestones should only appear in project-specific timeline/views
  const operationalItems = useMemo((): AtomItem[] => {
    return (itemsQuery.data || []).filter(item => 
      !item.tags?.some(tag => tag.toLowerCase() === "#milestone")
    );
  }, [itemsQuery.data]);

  // INTEGRITY: Filter milestones from overdue items too
  const operationalOverdueItems = useMemo((): AtomItem[] => {
    return (overdueQuery.data || []).filter(item => 
      !item.tags?.some(tag => tag.toLowerCase() === "#milestone")
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
    }, {} as Record<string, AtomItem[]>);
  }, [operationalItems]);

  return {
    items: operationalItems,
    itemsByDate,
    overdueItems: operationalOverdueItems,
    isLoading: itemsQuery.isLoading || overdueQuery.isLoading,
    error: itemsQuery.error || overdueQuery.error,
    refetch: () => {
      itemsQuery.refetch();
      overdueQuery.refetch();
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
