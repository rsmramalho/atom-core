// Atom Engine 4.0 - Dashboard Filters Tests
// Tests for B.10 specification

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
});
