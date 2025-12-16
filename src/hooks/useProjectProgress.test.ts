// Atom Engine 4.0 - Project Progress Tests
// Tests for B.9/A.18 specification - Hybrid Progress Engine
// Single Table Design: Milestones are items with #milestone tag

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useProjectProgress } from "./useProjectProgress";
import type { AtomItem } from "@/types/atom-engine";

// Helper to create mock task
const createMockTask = (overrides: Partial<AtomItem> = {}): AtomItem => ({
  id: `task-${Math.random()}`,
  user_id: "user-1",
  title: "Test Task",
  type: "task",
  module: null,
  tags: [],
  parent_id: null,
  project_id: "project-1",
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

// Helper to create mock milestone (task with #milestone tag and weight 3)
const createMockMilestone = (overrides: Partial<AtomItem> = {}): AtomItem => ({
  id: `milestone-${Math.random()}`,
  user_id: "user-1",
  title: "Test Milestone",
  type: "task",
  module: null,
  tags: ["#milestone"],
  parent_id: null,
  project_id: "project-1",
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

describe("useProjectProgress (B.9/A.18)", () => {
  describe("Empty Data", () => {
    it("should return 0 progress with no items", () => {
      const { result } = renderHook(() => useProjectProgress([]));

      expect(result.current.progress).toBe(0);
      expect(result.current.totalWeight).toBe(0);
      expect(result.current.completedWeight).toBe(0);
      expect(result.current.taskCount).toBe(0);
      expect(result.current.milestoneCount).toBe(0);
    });

    it("should return correct mode when specified", () => {
      const { result } = renderHook(() => 
        useProjectProgress([], { mode: 'milestone' })
      );
      expect(result.current.mode).toBe('milestone');
    });
  });

  // ==========================================
  // MODE: AUTO (Default)
  // ==========================================
  describe("Mode: Auto (Default)", () => {
    it("should use auto mode by default", () => {
      const { result } = renderHook(() => useProjectProgress([]));
      expect(result.current.mode).toBe('auto');
    });

    it("should calculate progress from tasks only (weight = 1 each)", () => {
      const tasks = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
        createMockTask({ completed: false }),
      ];

      const { result } = renderHook(() => 
        useProjectProgress(tasks, { mode: 'auto' })
      );

      expect(result.current.taskCount).toBe(4);
      expect(result.current.taskCompletedCount).toBe(2);
      expect(result.current.totalWeight).toBe(4);
      expect(result.current.completedWeight).toBe(2);
      expect(result.current.progress).toBe(50);
    });

    it("should calculate weighted progress combining tasks and milestones", () => {
      const items = [
        createMockTask({ completed: true }),  // weight 1
        createMockTask({ completed: false }), // weight 1
        createMockMilestone({ completed: true, weight: 3 }), // weight 3
      ];

      const { result } = renderHook(() => 
        useProjectProgress(items, { mode: 'auto' })
      );

      // Completed: 1 task (1) + 1 milestone (3) = 4
      // Total: 2 tasks (2) + 1 milestone (3) = 5
      expect(result.current.totalWeight).toBe(5);
      expect(result.current.completedWeight).toBe(4);
      expect(result.current.progress).toBe(80);
    });

    it("should demonstrate milestone 'Narrative Leap' effect", () => {
      const incompleteTasks = Array(10).fill(null).map(() => 
        createMockTask({ completed: false })
      );
      const milestone = createMockMilestone({ completed: false, weight: 3 });

      // Complete milestone
      const milestoneComplete = createMockMilestone({ completed: true, weight: 3 });
      const { result } = renderHook(() => 
        useProjectProgress([...incompleteTasks, milestoneComplete], { mode: 'auto' })
      );
      
      // After milestone: 3/13 ≈ 23%
      expect(result.current.progress).toBe(23);
    });
  });

  // ==========================================
  // MODE: MILESTONE
  // ==========================================
  describe("Mode: Milestone", () => {
    it("should ignore tasks completely in milestone mode", () => {
      const items = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockMilestone({ completed: false, weight: 3 }),
      ];

      const { result } = renderHook(() => 
        useProjectProgress(items, { mode: 'milestone' })
      );

      // Only milestone counts (0/3)
      expect(result.current.progress).toBe(0);
      expect(result.current.totalWeight).toBe(3);
      expect(result.current.completedWeight).toBe(0);
      expect(result.current.mode).toBe('milestone');
    });

    it("should calculate progress from milestones only", () => {
      const items = [
        createMockTask({ completed: true }),  // ignored
        createMockTask({ completed: false }), // ignored
        createMockMilestone({ completed: true, weight: 3 }),
        createMockMilestone({ completed: false, weight: 3 }),
      ];

      const { result } = renderHook(() => 
        useProjectProgress(items, { mode: 'milestone' })
      );

      // Only milestones: 3/6 = 50%
      expect(result.current.totalWeight).toBe(6);
      expect(result.current.completedWeight).toBe(3);
      expect(result.current.progress).toBe(50);
    });

    it("should return 0% with no milestones in milestone mode", () => {
      const tasks = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
      ];

      const { result } = renderHook(() => 
        useProjectProgress(tasks, { mode: 'milestone' })
      );

      // No milestones = 0/0 = 0%
      expect(result.current.progress).toBe(0);
      expect(result.current.totalWeight).toBe(0);
    });

    it("should handle milestones with different weights", () => {
      const items = [
        createMockMilestone({ completed: true, weight: 2 }),
        createMockMilestone({ completed: true, weight: 3 }),
        createMockMilestone({ completed: false, weight: 5 }),
      ];

      const { result } = renderHook(() => 
        useProjectProgress(items, { mode: 'milestone' })
      );

      // Completed: 2 + 3 = 5, Total: 2 + 3 + 5 = 10
      expect(result.current.totalWeight).toBe(10);
      expect(result.current.completedWeight).toBe(5);
      expect(result.current.progress).toBe(50);
    });

    it("should still track task stats even when ignored for progress", () => {
      const items = [
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
        createMockMilestone({ completed: true, weight: 3 }),
      ];

      const { result } = renderHook(() => 
        useProjectProgress(items, { mode: 'milestone' })
      );

      // Task stats are still tracked
      expect(result.current.taskCount).toBe(2);
      expect(result.current.taskCompletedCount).toBe(1);
      // But progress is milestone-only
      expect(result.current.progress).toBe(100);
    });
  });

  // ==========================================
  // MODE: MANUAL
  // ==========================================
  describe("Mode: Manual", () => {
    it("should use user-defined progress value", () => {
      const items = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockMilestone({ completed: true, weight: 5 }),
      ];

      const { result } = renderHook(() => 
        useProjectProgress(items, { mode: 'manual', manualProgress: 75 })
      );

      // Ignores all items, uses manual value
      expect(result.current.progress).toBe(75);
      expect(result.current.mode).toBe('manual');
    });

    it("should clamp manual progress to 0-100 range", () => {
      const { result: over } = renderHook(() => 
        useProjectProgress([], { mode: 'manual', manualProgress: 150 })
      );
      expect(over.current.progress).toBe(100);

      const { result: under } = renderHook(() => 
        useProjectProgress([], { mode: 'manual', manualProgress: -50 })
      );
      expect(under.current.progress).toBe(0);
    });

    it("should default manualProgress to 0 if not provided", () => {
      const { result } = renderHook(() => 
        useProjectProgress([], { mode: 'manual' })
      );
      expect(result.current.progress).toBe(0);
    });

    it("should return totalWeight=100, completedWeight=progress in manual mode", () => {
      const { result } = renderHook(() => 
        useProjectProgress([], { mode: 'manual', manualProgress: 42 })
      );

      expect(result.current.totalWeight).toBe(100);
      expect(result.current.completedWeight).toBe(42);
      expect(result.current.progress).toBe(42);
    });

    it("should still track task and milestone stats", () => {
      const items = [
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
        createMockMilestone({ completed: true, weight: 3 }),
        createMockMilestone({ completed: false, weight: 3 }),
      ];

      const { result } = renderHook(() => 
        useProjectProgress(items, { mode: 'manual', manualProgress: 30 })
      );

      // Stats are tracked but don't affect progress
      expect(result.current.taskCount).toBe(2);
      expect(result.current.taskCompletedCount).toBe(1);
      expect(result.current.milestoneCount).toBe(2);
      expect(result.current.milestoneCompletedCount).toBe(1);
      // Progress is manual
      expect(result.current.progress).toBe(30);
    });
  });

  // ==========================================
  // HYBRID SCENARIOS
  // ==========================================
  describe("Hybrid Progress (Tasks + Milestones - Auto Mode)", () => {
    it("should handle real-world project scenario", () => {
      const items = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
        createMockTask({ completed: false }),
        createMockTask({ completed: false }),
        createMockMilestone({ completed: true, weight: 3 }),
        createMockMilestone({ completed: false, weight: 3 }),
        createMockMilestone({ completed: false, weight: 3 }),
      ];

      const { result } = renderHook(() => useProjectProgress(items));

      // Total weight: 5 tasks (5) + 3 milestones (9) = 14
      // Completed: 2 tasks (2) + 1 milestone (3) = 5
      expect(result.current.taskCount).toBe(5);
      expect(result.current.taskCompletedCount).toBe(2);
      expect(result.current.milestoneCount).toBe(3);
      expect(result.current.milestoneCompletedCount).toBe(1);
      expect(result.current.totalWeight).toBe(14);
      expect(result.current.completedWeight).toBe(5);
      expect(result.current.progress).toBe(36);
    });
  });

  // ==========================================
  // NON-TASK ITEMS
  // ==========================================
  describe("Non-Task Items", () => {
    it("should ignore non-task items (habits, notes, etc.)", () => {
      const items = [
        createMockTask({ type: "habit", completed: true }),
        createMockTask({ type: "note", completed: true }),
        createMockTask({ type: "task", completed: false }),
      ];

      const { result } = renderHook(() => useProjectProgress(items));

      expect(result.current.taskCount).toBe(1);
      expect(result.current.taskCompletedCount).toBe(0);
      expect(result.current.progress).toBe(0);
    });
  });

  // ==========================================
  // EDGE CASES
  // ==========================================
  describe("Edge Cases", () => {
    it("should round progress to nearest integer", () => {
      const tasks = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
      ];

      const { result } = renderHook(() => useProjectProgress(tasks));
      expect(result.current.progress).toBe(67);
    });

    it("should handle single item", () => {
      const { result: incomplete } = renderHook(() => 
        useProjectProgress([createMockTask({ completed: false })])
      );
      expect(incomplete.current.progress).toBe(0);

      const { result: complete } = renderHook(() => 
        useProjectProgress([createMockTask({ completed: true })])
      );
      expect(complete.current.progress).toBe(100);
    });

    it("should handle single milestone", () => {
      const { result: incomplete } = renderHook(() => 
        useProjectProgress([createMockMilestone({ completed: false })])
      );
      expect(incomplete.current.progress).toBe(0);

      const { result: complete } = renderHook(() => 
        useProjectProgress([createMockMilestone({ completed: true })])
      );
      expect(complete.current.progress).toBe(100);
    });

    it("should handle null weight by using default", () => {
      const task = createMockTask({ completed: true, weight: null });
      const milestone = createMockMilestone({ completed: false, weight: null });

      const { result } = renderHook(() => 
        useProjectProgress([task, milestone])
      );

      // Task default weight: 1, Milestone default weight: 3
      expect(result.current.totalWeight).toBe(4);
      expect(result.current.completedWeight).toBe(1);
      expect(result.current.progress).toBe(25);
    });
  });

  // ==========================================
  // MODE SWITCHING
  // ==========================================
  describe("Mode Switching", () => {
    const items = [
      createMockTask({ completed: true }),  // weight 1
      createMockTask({ completed: false }), // weight 1
      createMockMilestone({ completed: true, weight: 4 }),
      createMockMilestone({ completed: false, weight: 4 }),
    ];

    it("should give different results for different modes", () => {
      const { result: autoResult } = renderHook(() => 
        useProjectProgress(items, { mode: 'auto' })
      );
      // Auto: (1 + 4) / (2 + 8) = 5/10 = 50%
      expect(autoResult.current.progress).toBe(50);

      const { result: milestoneResult } = renderHook(() => 
        useProjectProgress(items, { mode: 'milestone' })
      );
      // Milestone: 4 / 8 = 50%
      expect(milestoneResult.current.progress).toBe(50);

      const { result: manualResult } = renderHook(() => 
        useProjectProgress(items, { mode: 'manual', manualProgress: 25 })
      );
      // Manual: 25%
      expect(manualResult.current.progress).toBe(25);
    });

    it("should demonstrate auto vs milestone difference", () => {
      // All tasks complete, no milestones complete
      const allTasksComplete = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockMilestone({ completed: false, weight: 6 }),
      ];

      const { result: autoResult } = renderHook(() => 
        useProjectProgress(allTasksComplete, { mode: 'auto' })
      );
      // Auto: 2 / 8 = 25%
      expect(autoResult.current.progress).toBe(25);

      const { result: milestoneResult } = renderHook(() => 
        useProjectProgress(allTasksComplete, { mode: 'milestone' })
      );
      // Milestone: 0 / 6 = 0%
      expect(milestoneResult.current.progress).toBe(0);
    });
  });
});
