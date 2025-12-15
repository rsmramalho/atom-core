// Atom Engine 4.0 - Dashboard Filter Functions (B.10)
// Pure functions for filtering items - extracted for testability

import { isToday, isBefore, startOfDay } from "date-fns";
import type { AtomItem, RitualSlot } from "@/types/atom-engine";

/**
 * Get current ritual slot based on time of day
 * Aurora: 5:00 - 11:59 (manha)
 * Zênite: 12:00 - 17:59 (meio_dia)
 * Crepúsculo: 18:00 - 4:59 (noite)
 */
export function getCurrentRitualSlot(date: Date = new Date()): RitualSlot {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "manha";
  if (hour >= 12 && hour < 18) return "meio_dia";
  return "noite";
}

/**
 * Filter items with #focus tag
 * Returns active (non-completed) items that have #focus tag
 */
export function filterFocus(items: AtomItem[]): AtomItem[] {
  return items.filter(
    (item) =>
      !item.completed &&
      item.tags.some((tag) => tag.toLowerCase() === "#focus")
  );
}

/**
 * Filter items due today or overdue
 * Excludes ritual items and projects
 */
export function filterToday(
  items: AtomItem[],
  referenceDate: Date = new Date()
): AtomItem[] {
  const today = startOfDay(referenceDate);

  return items.filter((item) => {
    // Must be active
    if (item.completed) return false;
    // Exclude items with ritual_slot
    if (item.ritual_slot) return false;
    // Exclude projects
    if (item.type === "project") return false;
    // Must have a due_date
    if (!item.due_date) return false;

    const dueDate = startOfDay(new Date(item.due_date));
    // Include if due today or overdue
    return isToday(dueDate) || isBefore(dueDate, today);
  });
}

/**
 * Split today items into overdue and due today
 */
export function splitTodayItems(
  todayItems: AtomItem[],
  referenceDate: Date = new Date()
): { overdueItems: AtomItem[]; dueTodayItems: AtomItem[] } {
  const today = startOfDay(referenceDate);
  const overdue: AtomItem[] = [];
  const dueToday: AtomItem[] = [];

  todayItems.forEach((item) => {
    if (!item.due_date) return;
    const dueDate = startOfDay(new Date(item.due_date));
    if (isBefore(dueDate, today)) {
      overdue.push(item);
    } else {
      dueToday.push(item);
    }
  });

  return { overdueItems: overdue, dueTodayItems: dueToday };
}

/**
 * Filter ritual items for current slot
 * Returns habits with matching ritual_slot
 */
export function filterRitual(
  items: AtomItem[],
  slot: RitualSlot
): AtomItem[] {
  if (!slot) return [];
  
  return items.filter(
    (item) =>
      !item.completed &&
      item.type === "habit" &&
      item.ritual_slot === slot
  );
}

/**
 * Filter active projects
 */
export function filterProjects(items: AtomItem[]): AtomItem[] {
  return items.filter(
    (item) =>
      item.type === "project" &&
      item.project_status === "active"
  );
}

/**
 * Get items belonging to a project
 */
export function getProjectItems(
  items: AtomItem[],
  projectId: string
): AtomItem[] {
  return items.filter((item) => item.project_id === projectId);
}

/**
 * Calculate simple project progress (tasks only, no weighted milestones)
 */
export function calculateSimpleProgress(projectItems: AtomItem[]): number {
  if (projectItems.length === 0) return 0;
  
  const completed = projectItems.filter((i) => i.completed).length;
  return Math.round((completed / projectItems.length) * 100);
}
