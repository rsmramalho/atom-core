// Atom Engine 4.0 - Dashboard Filters Tests
// Tests for B.10 specification + B.3 Integrity Guards

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getCurrentRitualSlot,
  filterFocus,
  filterToday,
  splitTodayItems,
  filterRitual,
  filterProjects,
  getProjectItems,
  calculateSimpleProgress,
  isMilestone,
  isOperationalItem,
} from "./dashboard-filters";
import { format, subDays, addDays } from "date-fns";
import type { AtomItem } from "@/types/atom-engine";

// Helper to create mock item
const createMockItem = (overrides: Partial<AtomItem> = {}): AtomItem => ({
  id: `item-${Math.random()}`,
  user_id: "user-1",
  title: "Test Item",
  type: "task",
  module: null,
  tags: [],
  parent_id: null,
  project_id: null,
  due_date: null,
  recurrence_rule: null,
  ritual_slot: null,
  completed: false,
  completed_at: null,
  notes: null,
  checklist: [],
  project_status: null,
  progress_mode: null,
  progress: null,
  deadline: null,
  weight: 1,
  order_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

describe("Dashboard Filters (B.10)", () => {
  describe("getCurrentRitualSlot", () => {
    it("should return 'manha' for morning hours (5-11)", () => {
      expect(getCurrentRitualSlot(new Date("2025-01-01T05:00:00"))).toBe("manha");
      expect(getCurrentRitualSlot(new Date("2025-01-01T08:30:00"))).toBe("manha");
      expect(getCurrentRitualSlot(new Date("2025-01-01T11:59:00"))).toBe("manha");
    });

    it("should return 'meio_dia' for afternoon hours (12-17)", () => {
      expect(getCurrentRitualSlot(new Date("2025-01-01T12:00:00"))).toBe("meio_dia");
      expect(getCurrentRitualSlot(new Date("2025-01-01T14:30:00"))).toBe("meio_dia");
      expect(getCurrentRitualSlot(new Date("2025-01-01T17:59:00"))).toBe("meio_dia");
    });

    it("should return 'noite' for evening/night hours (18-4)", () => {
      expect(getCurrentRitualSlot(new Date("2025-01-01T18:00:00"))).toBe("noite");
      expect(getCurrentRitualSlot(new Date("2025-01-01T22:00:00"))).toBe("noite");
      expect(getCurrentRitualSlot(new Date("2025-01-01T00:00:00"))).toBe("noite");
      expect(getCurrentRitualSlot(new Date("2025-01-01T04:59:00"))).toBe("noite");
    });
  });

  describe("filterFocus", () => {
    it("should return items with #focus tag", () => {
      const items = [
        createMockItem({ tags: ["#focus"] }),
        createMockItem({ tags: ["#work"] }),
        createMockItem({ tags: ["#focus", "#urgent"] }),
      ];

      const result = filterFocus(items);
      expect(result.length).toBe(2);
    });

    it("should handle #focus tag case-insensitively", () => {
      const items = [
        createMockItem({ tags: ["#FOCUS"] }),
        createMockItem({ tags: ["#Focus"] }),
        createMockItem({ tags: ["#focus"] }),
      ];

      const result = filterFocus(items);
      expect(result.length).toBe(3);
    });

    it("should exclude completed items", () => {
      const items = [
        createMockItem({ tags: ["#focus"], completed: false }),
        createMockItem({ tags: ["#focus"], completed: true }),
      ];

      const result = filterFocus(items);
      expect(result.length).toBe(1);
    });

    it("should return empty array when no focus items", () => {
      const items = [
        createMockItem({ tags: ["#work"] }),
        createMockItem({ tags: [] }),
      ];

      const result = filterFocus(items);
      expect(result.length).toBe(0);
    });
  });

  describe("filterToday", () => {
    const today = new Date("2025-01-15");
    const todayStr = format(today, "yyyy-MM-dd");
    const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd");
    const tomorrowStr = format(addDays(today, 1), "yyyy-MM-dd");

    it("should return items due today", () => {
      const items = [
        createMockItem({ due_date: todayStr }),
        createMockItem({ due_date: tomorrowStr }),
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(1);
      expect(result[0].due_date).toBe(todayStr);
    });

    it("should include overdue items", () => {
      const items = [
        createMockItem({ due_date: yesterdayStr }),
        createMockItem({ due_date: todayStr }),
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(2);
    });

    it("should exclude items without due_date", () => {
      const items = [
        createMockItem({ due_date: null }),
        createMockItem({ due_date: todayStr }),
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(1);
    });

    it("should exclude completed items", () => {
      const items = [
        createMockItem({ due_date: todayStr, completed: false }),
        createMockItem({ due_date: todayStr, completed: true }),
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(1);
    });

    it("should exclude items with ritual_slot", () => {
      const items = [
        createMockItem({ due_date: todayStr, ritual_slot: null }),
        createMockItem({ due_date: todayStr, ritual_slot: "manha" }),
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(1);
    });

    it("should exclude projects", () => {
      const items = [
        createMockItem({ due_date: todayStr, type: "task" }),
        createMockItem({ due_date: todayStr, type: "project" }),
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(1);
    });
  });

  describe("splitTodayItems", () => {
    const today = new Date("2025-01-15");
    const todayStr = format(today, "yyyy-MM-dd");
    const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd");
    const lastWeekStr = format(subDays(today, 7), "yyyy-MM-dd");

    it("should split items into overdue and due today", () => {
      const items = [
        createMockItem({ due_date: yesterdayStr }),
        createMockItem({ due_date: lastWeekStr }),
        createMockItem({ due_date: todayStr }),
      ];

      const { overdueItems, dueTodayItems } = splitTodayItems(items, today);
      
      expect(overdueItems.length).toBe(2);
      expect(dueTodayItems.length).toBe(1);
    });

    it("should handle empty array", () => {
      const { overdueItems, dueTodayItems } = splitTodayItems([], today);
      
      expect(overdueItems.length).toBe(0);
      expect(dueTodayItems.length).toBe(0);
    });

    it("should handle all overdue items", () => {
      const items = [
        createMockItem({ due_date: yesterdayStr }),
        createMockItem({ due_date: lastWeekStr }),
      ];

      const { overdueItems, dueTodayItems } = splitTodayItems(items, today);
      
      expect(overdueItems.length).toBe(2);
      expect(dueTodayItems.length).toBe(0);
    });

    it("should handle all today items", () => {
      const items = [
        createMockItem({ due_date: todayStr }),
        createMockItem({ due_date: todayStr }),
      ];

      const { overdueItems, dueTodayItems } = splitTodayItems(items, today);
      
      expect(overdueItems.length).toBe(0);
      expect(dueTodayItems.length).toBe(2);
    });
  });

  describe("filterRitual", () => {
    it("should return habits matching current ritual slot", () => {
      const items = [
        createMockItem({ type: "habit", ritual_slot: "manha" }),
        createMockItem({ type: "habit", ritual_slot: "meio_dia" }),
        createMockItem({ type: "habit", ritual_slot: "noite" }),
      ];

      const result = filterRitual(items, "manha");
      expect(result.length).toBe(1);
      expect(result[0].ritual_slot).toBe("manha");
    });

    it("should exclude non-habit items", () => {
      const items = [
        createMockItem({ type: "habit", ritual_slot: "manha" }),
        createMockItem({ type: "task", ritual_slot: "manha" }),
      ];

      const result = filterRitual(items, "manha");
      expect(result.length).toBe(1);
    });

    it("should exclude completed habits", () => {
      const items = [
        createMockItem({ type: "habit", ritual_slot: "manha", completed: false }),
        createMockItem({ type: "habit", ritual_slot: "manha", completed: true }),
      ];

      const result = filterRitual(items, "manha");
      expect(result.length).toBe(1);
    });

    it("should return empty for null slot", () => {
      const items = [
        createMockItem({ type: "habit", ritual_slot: "manha" }),
      ];

      const result = filterRitual(items, null);
      expect(result.length).toBe(0);
    });
  });

  describe("filterProjects", () => {
    it("should return only active projects", () => {
      const items = [
        createMockItem({ type: "project", project_status: "active" }),
        createMockItem({ type: "project", project_status: "draft" }),
        createMockItem({ type: "project", project_status: "completed" }),
        createMockItem({ type: "task" }),
      ];

      const result = filterProjects(items);
      expect(result.length).toBe(1);
      expect(result[0].project_status).toBe("active");
    });

    it("should return empty for no active projects", () => {
      const items = [
        createMockItem({ type: "project", project_status: "draft" }),
        createMockItem({ type: "task" }),
      ];

      const result = filterProjects(items);
      expect(result.length).toBe(0);
    });
  });

  describe("getProjectItems", () => {
    it("should return items belonging to project", () => {
      const items = [
        createMockItem({ project_id: "project-1" }),
        createMockItem({ project_id: "project-1" }),
        createMockItem({ project_id: "project-2" }),
        createMockItem({ project_id: null }),
      ];

      const result = getProjectItems(items, "project-1");
      expect(result.length).toBe(2);
    });

    it("should return empty for non-existent project", () => {
      const items = [
        createMockItem({ project_id: "project-1" }),
      ];

      const result = getProjectItems(items, "project-999");
      expect(result.length).toBe(0);
    });
  });

  describe("calculateSimpleProgress", () => {
    it("should calculate percentage of completed items", () => {
      const items = [
        createMockItem({ completed: true }),
        createMockItem({ completed: true }),
        createMockItem({ completed: false }),
        createMockItem({ completed: false }),
      ];

      const result = calculateSimpleProgress(items);
      expect(result).toBe(50);
    });

    it("should return 0 for empty array", () => {
      const result = calculateSimpleProgress([]);
      expect(result).toBe(0);
    });

    it("should return 100 when all completed", () => {
      const items = [
        createMockItem({ completed: true }),
        createMockItem({ completed: true }),
      ];

      const result = calculateSimpleProgress(items);
      expect(result).toBe(100);
    });

    it("should return 0 when none completed", () => {
      const items = [
        createMockItem({ completed: false }),
        createMockItem({ completed: false }),
      ];

      const result = calculateSimpleProgress(items);
      expect(result).toBe(0);
    });

    it("should round to nearest integer", () => {
      const items = [
        createMockItem({ completed: true }),
        createMockItem({ completed: false }),
        createMockItem({ completed: false }),
      ];

      // 1/3 = 33.33% → 33%
      const result = calculateSimpleProgress(items);
      expect(result).toBe(33);
    });
  });

  // ============================================
  // INTEGRITY GUARDS TESTS (Engine B.3)
  // ============================================

  describe("isMilestone - Integrity Helper", () => {
    it("should return true for items with #milestone tag", () => {
      const item = createMockItem({ tags: ["#milestone"] });
      expect(isMilestone(item)).toBe(true);
    });

    it("should handle #milestone tag case-insensitively", () => {
      expect(isMilestone(createMockItem({ tags: ["#MILESTONE"] }))).toBe(true);
      expect(isMilestone(createMockItem({ tags: ["#Milestone"] }))).toBe(true);
    });

    it("should return false for items without #milestone tag", () => {
      const item = createMockItem({ tags: ["#focus", "#work"] });
      expect(isMilestone(item)).toBe(false);
    });

    it("should return false for items with empty tags", () => {
      const item = createMockItem({ tags: [] });
      expect(isMilestone(item)).toBe(false);
    });

    it("should handle items with #milestone among other tags", () => {
      const item = createMockItem({ tags: ["#focus", "#milestone", "#urgent"] });
      expect(isMilestone(item)).toBe(true);
    });
  });

  describe("isOperationalItem - Integrity Helper", () => {
    it("should return true for regular tasks", () => {
      const item = createMockItem({ type: "task", tags: [] });
      expect(isOperationalItem(item)).toBe(true);
    });

    it("should return true for habits", () => {
      const item = createMockItem({ type: "habit", tags: [] });
      expect(isOperationalItem(item)).toBe(true);
    });

    it("should return false for reflections (non-actionable)", () => {
      const item = createMockItem({ type: "reflection", tags: [] });
      expect(isOperationalItem(item)).toBe(false);
    });

    it("should return false for milestones (project-specific only)", () => {
      const item = createMockItem({ type: "task", tags: ["#milestone"] });
      expect(isOperationalItem(item)).toBe(false);
    });

    it("should return false for milestone even with other tags", () => {
      const item = createMockItem({ type: "task", tags: ["#focus", "#milestone"] });
      expect(isOperationalItem(item)).toBe(false);
    });
  });

  describe("Milestone Isolation in filterFocus", () => {
    it("should EXCLUDE milestones from focus list", () => {
      const items = [
        createMockItem({ tags: ["#focus"] }),
        createMockItem({ tags: ["#focus", "#milestone"] }), // Should be excluded
        createMockItem({ tags: ["#focus", "#urgent"] }),
      ];

      const result = filterFocus(items);
      expect(result.length).toBe(2);
      expect(result.every(item => !isMilestone(item))).toBe(true);
    });

    it("should include focus items that are NOT milestones", () => {
      const items = [
        createMockItem({ id: "task-1", tags: ["#focus"], type: "task" }),
        createMockItem({ id: "habit-1", tags: ["#focus"], type: "habit" }),
      ];

      const result = filterFocus(items);
      expect(result.length).toBe(2);
    });
  });

  describe("Milestone Isolation in filterToday", () => {
    const today = new Date("2025-01-15");
    const todayStr = format(today, "yyyy-MM-dd");

    it("should EXCLUDE milestones from today list", () => {
      const items = [
        createMockItem({ due_date: todayStr, type: "task", tags: [] }),
        createMockItem({ due_date: todayStr, type: "task", tags: ["#milestone"] }), // Should be excluded
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(1);
      expect(isMilestone(result[0])).toBe(false);
    });

    it("should EXCLUDE reflections from today list", () => {
      const items = [
        createMockItem({ due_date: todayStr, type: "task", tags: [] }),
        createMockItem({ due_date: todayStr, type: "reflection", tags: [] }), // Should be excluded
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(1);
      expect(result[0].type).toBe("task");
    });

    it("should correctly filter mixed operational items", () => {
      const items = [
        createMockItem({ due_date: todayStr, type: "task", tags: [] }), // ✓ included
        createMockItem({ due_date: todayStr, type: "task", tags: ["#milestone"] }), // ✗ milestone
        createMockItem({ due_date: todayStr, type: "reflection", tags: [] }), // ✗ reflection
        createMockItem({ due_date: todayStr, type: "habit", tags: [] }), // ✓ included
        createMockItem({ due_date: todayStr, type: "note", tags: [] }), // ✓ included
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(3);
    });
  });

  describe("Reflection Lock - Non-Actionable Items", () => {
    it("reflections should NOT appear in filterFocus even with #focus tag", () => {
      const items = [
        createMockItem({ type: "reflection", tags: ["#focus"] }),
        createMockItem({ type: "task", tags: ["#focus"] }),
      ];

      const result = filterFocus(items);
      expect(result.length).toBe(1);
      expect(result[0].type).toBe("task");
    });

    it("reflections should NOT appear in filterToday even with due_date", () => {
      const today = new Date("2025-01-15");
      const todayStr = format(today, "yyyy-MM-dd");

      const items = [
        createMockItem({ type: "reflection", due_date: todayStr }),
        createMockItem({ type: "task", due_date: todayStr }),
      ];

      const result = filterToday(items, today);
      expect(result.length).toBe(1);
      expect(result[0].type).toBe("task");
    });

    it("filterRitual should NOT include reflections", () => {
      const items = [
        createMockItem({ type: "reflection", ritual_slot: "manha" }),
        createMockItem({ type: "habit", ritual_slot: "manha" }),
      ];

      const result = filterRitual(items, "manha");
      expect(result.length).toBe(1);
      expect(result[0].type).toBe("habit");
    });
  });

  describe("Edge Cases - Integrity Guards", () => {
    it("should handle items with null/undefined tags gracefully", () => {
      const itemWithNullTags = {
        ...createMockItem(),
        tags: null as unknown as string[],
      };

      // Should not throw
      expect(isMilestone(itemWithNullTags)).toBe(false);
    });

    it("should handle empty items array", () => {
      expect(filterFocus([])).toEqual([]);
      expect(filterToday([])).toEqual([]);
    });

    it("milestone with #focus should still be excluded from operational lists", () => {
      const today = new Date("2025-01-15");
      const todayStr = format(today, "yyyy-MM-dd");

      const milestone = createMockItem({
        type: "task",
        tags: ["#focus", "#milestone"],
        due_date: todayStr,
      });

      // Should be excluded from focus
      expect(filterFocus([milestone]).length).toBe(0);
      
      // Should be excluded from today
      expect(filterToday([milestone], today).length).toBe(0);
    });
  });
});
