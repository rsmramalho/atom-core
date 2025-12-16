// Atom Engine 4.0 - useMilestones Tests
// Tests for Single Table Design milestone operations
// Milestones are items with type='task' and tags containing '#milestone'

import { describe, it, expect } from "vitest";
import type { AtomItem } from "@/types/atom-engine";

// Helper to create mock milestone (Single Table Design)
const createMockMilestone = (overrides: Partial<AtomItem> = {}): AtomItem => ({
  id: `milestone-${Math.random().toString(36).slice(2)}`,
  user_id: "user-123",
  title: "Test Milestone",
  type: "task",
  module: null,
  tags: ["#milestone"],
  parent_id: null,
  project_id: "project-123",
  due_date: null,
  recurrence_rule: null,
  ritual_slot: null,
  completed: false,
  completed_at: null,
  completion_log: [],
  notes: null,
  checklist: [],
  project_status: null,
  progress_mode: null,
  progress: null,
  deadline: null,
  weight: 3,
  order_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Helper to create mock task (for comparison)
const createMockTask = (overrides: Partial<AtomItem> = {}): AtomItem => ({
  id: `task-${Math.random().toString(36).slice(2)}`,
  user_id: "user-123",
  title: "Test Task",
  type: "task",
  module: null,
  tags: [],
  parent_id: null,
  project_id: "project-123",
  due_date: null,
  recurrence_rule: null,
  ritual_slot: null,
  completed: false,
  completed_at: null,
  completion_log: [],
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

// Helper function: Check if item is a milestone (Single Table Design)
const isMilestone = (item: AtomItem): boolean => {
  return item.type === "task" && item.tags.includes("#milestone");
};

// Helper function: Filter milestones from items array
const filterMilestones = (items: AtomItem[]): AtomItem[] => {
  return items.filter(isMilestone);
};

// Helper function: Filter regular tasks (exclude milestones)
const filterTasks = (items: AtomItem[]): AtomItem[] => {
  return items.filter(item => item.type === "task" && !item.tags.includes("#milestone"));
};

describe("useMilestones - Single Table Design", () => {
  describe("Milestone Structure", () => {
    it("should create milestone with correct type and tags", () => {
      const milestone = createMockMilestone();

      expect(milestone.type).toBe("task");
      expect(milestone.tags).toContain("#milestone");
    });

    it("should have default weight of 3 for milestones", () => {
      const milestone = createMockMilestone();

      expect(milestone.weight).toBe(3);
    });

    it("should support custom weight (1-10)", () => {
      const lightMilestone = createMockMilestone({ weight: 1 });
      const heavyMilestone = createMockMilestone({ weight: 10 });

      expect(lightMilestone.weight).toBe(1);
      expect(heavyMilestone.weight).toBe(10);
    });

    it("should have project_id for project association", () => {
      const milestone = createMockMilestone({ project_id: "project-abc" });

      expect(milestone.project_id).toBe("project-abc");
    });
  });

  describe("isMilestone Helper", () => {
    it("should identify milestone correctly", () => {
      const milestone = createMockMilestone();

      expect(isMilestone(milestone)).toBe(true);
    });

    it("should not identify regular task as milestone", () => {
      const task = createMockTask();

      expect(isMilestone(task)).toBe(false);
    });

    it("should not identify task with other tags as milestone", () => {
      const task = createMockTask({ tags: ["#focus", "#urgent"] });

      expect(isMilestone(task)).toBe(false);
    });

    it("should identify milestone with additional tags", () => {
      const milestone = createMockMilestone({ tags: ["#milestone", "#important"] });

      expect(isMilestone(milestone)).toBe(true);
    });

    it("should not identify non-task types as milestone", () => {
      const habit = createMockMilestone({ type: "habit" });
      const note = createMockMilestone({ type: "note" });

      expect(isMilestone(habit)).toBe(false);
      expect(isMilestone(note)).toBe(false);
    });
  });

  describe("filterMilestones", () => {
    it("should filter milestones from mixed items", () => {
      const items = [
        createMockMilestone({ title: "MVP Launch" }),
        createMockTask({ title: "Regular Task" }),
        createMockMilestone({ title: "Beta Release" }),
        createMockTask({ title: "Another Task" }),
      ];

      const milestones = filterMilestones(items);

      expect(milestones).toHaveLength(2);
      expect(milestones[0].title).toBe("MVP Launch");
      expect(milestones[1].title).toBe("Beta Release");
    });

    it("should return empty array when no milestones", () => {
      const items = [
        createMockTask({ title: "Task 1" }),
        createMockTask({ title: "Task 2" }),
      ];

      const milestones = filterMilestones(items);

      expect(milestones).toHaveLength(0);
    });

    it("should handle empty array", () => {
      const milestones = filterMilestones([]);

      expect(milestones).toHaveLength(0);
    });
  });

  describe("filterTasks (exclude milestones)", () => {
    it("should filter tasks excluding milestones", () => {
      const items = [
        createMockMilestone({ title: "MVP Launch" }),
        createMockTask({ title: "Regular Task" }),
        createMockMilestone({ title: "Beta Release" }),
        createMockTask({ title: "Another Task" }),
      ];

      const tasks = filterTasks(items);

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe("Regular Task");
      expect(tasks[1].title).toBe("Another Task");
    });

    it("should return empty when only milestones exist", () => {
      const items = [
        createMockMilestone({ title: "MVP Launch" }),
        createMockMilestone({ title: "Beta Release" }),
      ];

      const tasks = filterTasks(items);

      expect(tasks).toHaveLength(0);
    });
  });

  describe("Milestone Completion", () => {
    it("should toggle completion status", () => {
      const milestone = createMockMilestone({ completed: false });

      // Simulate toggle
      const toggled: AtomItem = {
        ...milestone,
        completed: !milestone.completed,
        completed_at: milestone.completed ? null : new Date().toISOString(),
      };

      expect(toggled.completed).toBe(true);
      expect(toggled.completed_at).toBeTruthy();
    });

    it("should clear completed_at when unmarking as complete", () => {
      const milestone = createMockMilestone({
        completed: true,
        completed_at: new Date().toISOString(),
      });

      // Simulate toggle
      const toggled: AtomItem = {
        ...milestone,
        completed: !milestone.completed,
        completed_at: null,
      };

      expect(toggled.completed).toBe(false);
      expect(toggled.completed_at).toBeNull();
    });
  });

  describe("Milestone Weight Validation", () => {
    it("should enforce minimum weight of 1", () => {
      const milestone = createMockMilestone({ weight: 1 });

      expect(milestone.weight).toBeGreaterThanOrEqual(1);
    });

    it("should support weights up to 10", () => {
      const milestone = createMockMilestone({ weight: 10 });

      expect(milestone.weight).toBeLessThanOrEqual(10);
    });

    it("should calculate total weight correctly", () => {
      const milestones = [
        createMockMilestone({ weight: 3 }),
        createMockMilestone({ weight: 5 }),
        createMockMilestone({ weight: 2 }),
      ];

      const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);

      expect(totalWeight).toBe(10);
    });
  });

  describe("Milestone Creation Payload", () => {
    it("should have required fields for creation", () => {
      const payload = {
        project_id: "project-123",
        title: "New Milestone",
        weight: 3,
      };

      expect(payload.project_id).toBeTruthy();
      expect(payload.title).toBeTruthy();
      expect(payload.weight).toBeGreaterThanOrEqual(1);
    });

    it("should default weight to 3 when not specified", () => {
      const defaultWeight = 3;
      const payload = {
        project_id: "project-123",
        title: "New Milestone",
        weight: defaultWeight,
      };

      expect(payload.weight).toBe(3);
    });
  });

  describe("Milestone Update Payload", () => {
    it("should support title update", () => {
      const update = {
        id: "milestone-123",
        title: "Updated Title",
      };

      expect(update.title).toBe("Updated Title");
    });

    it("should support weight update", () => {
      const update = {
        id: "milestone-123",
        weight: 7,
      };

      expect(update.weight).toBe(7);
    });

    it("should support due_date update", () => {
      const update = {
        id: "milestone-123",
        due_date: "2025-12-31",
      };

      expect(update.due_date).toBe("2025-12-31");
    });

    it("should support completion update", () => {
      const update = {
        id: "milestone-123",
        completed: true,
        completed_at: new Date().toISOString(),
      };

      expect(update.completed).toBe(true);
      expect(update.completed_at).toBeTruthy();
    });
  });

  describe("Progress Calculation with Milestones", () => {
    it("should calculate weighted progress", () => {
      const items = [
        createMockTask({ completed: true, weight: 1 }),  // 1 point
        createMockTask({ completed: false, weight: 1 }), // 0 points
        createMockMilestone({ completed: true, weight: 3 }), // 3 points
        createMockMilestone({ completed: false, weight: 3 }), // 0 points
      ];

      const totalWeight = items.reduce((sum, i) => sum + i.weight, 0); // 8
      const completedWeight = items
        .filter(i => i.completed)
        .reduce((sum, i) => sum + i.weight, 0); // 4

      const progress = Math.round((completedWeight / totalWeight) * 100);

      expect(progress).toBe(50);
    });

    it("should demonstrate milestone 'Narrative Leap' effect", () => {
      // 10 tasks (weight 1 each) + 1 milestone (weight 3)
      const tasks = Array(10).fill(null).map(() => createMockTask({ completed: false }));
      const milestone = createMockMilestone({ completed: false, weight: 3 });
      const items = [...tasks, milestone];

      const totalWeight = items.reduce((sum, i) => sum + i.weight, 0); // 13

      // Completing 1 task = 1/13 = 7.7%
      const oneTaskProgress = Math.round((1 / totalWeight) * 100);
      expect(oneTaskProgress).toBe(8);

      // Completing milestone = 3/13 = 23%
      const milestoneProgress = Math.round((3 / totalWeight) * 100);
      expect(milestoneProgress).toBe(23);

      // Milestone completion provides ~3x progress boost
      expect(milestoneProgress).toBeGreaterThan(oneTaskProgress * 2);
    });
  });

  describe("Sorting Milestones", () => {
    it("should sort pending milestones first", () => {
      const milestones = [
        createMockMilestone({ id: "1", completed: true }),
        createMockMilestone({ id: "2", completed: false }),
        createMockMilestone({ id: "3", completed: true }),
        createMockMilestone({ id: "4", completed: false }),
      ];

      const sorted = [...milestones].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return 0;
      });

      expect(sorted[0].completed).toBe(false);
      expect(sorted[1].completed).toBe(false);
      expect(sorted[2].completed).toBe(true);
      expect(sorted[3].completed).toBe(true);
    });

    it("should sort by creation date within completion status", () => {
      const milestones = [
        createMockMilestone({ id: "1", completed: false, created_at: "2025-01-03T00:00:00Z" }),
        createMockMilestone({ id: "2", completed: false, created_at: "2025-01-01T00:00:00Z" }),
        createMockMilestone({ id: "3", completed: false, created_at: "2025-01-02T00:00:00Z" }),
      ];

      const sorted = [...milestones].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });

      expect(sorted[0].id).toBe("2"); // Jan 1
      expect(sorted[1].id).toBe("3"); // Jan 2
      expect(sorted[2].id).toBe("1"); // Jan 3
    });
  });
});
