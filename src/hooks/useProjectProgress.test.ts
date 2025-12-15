// Atom Engine 4.0 - Project Progress Tests
// Tests for B.9 specification - Weighted Progress Calculation

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useProjectProgress } from "./useProjectProgress";
import type { AtomItem } from "@/types/atom-engine";
import type { Milestone } from "./useMilestones";

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
  notes: null,
  checklist: [],
  project_status: null,
  progress_mode: null,
  progress: null,
  deadline: null,
  milestones: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Helper to create mock milestone
const createMockMilestone = (overrides: Partial<Milestone> = {}): Milestone => ({
  id: `milestone-${Math.random()}`,
  project_id: "project-1",
  user_id: "user-1",
  title: "Test Milestone",
  completed: false,
  completed_at: null,
  weight: 3,
  due_date: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

describe("useProjectProgress (B.9)", () => {
  describe("Empty Data", () => {
    it("should return 0 progress with no items and no milestones", () => {
      const { result } = renderHook(() => useProjectProgress([], []));

      expect(result.current.progress).toBe(0);
      expect(result.current.totalWeight).toBe(0);
      expect(result.current.completedWeight).toBe(0);
      expect(result.current.taskCount).toBe(0);
      expect(result.current.milestoneCount).toBe(0);
    });
  });

  describe("Tasks Only", () => {
    it("should calculate progress from tasks only (weight = 1 each)", () => {
      const tasks = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
        createMockTask({ completed: false }),
      ];

      const { result } = renderHook(() => useProjectProgress(tasks, []));

      expect(result.current.taskCount).toBe(4);
      expect(result.current.taskCompletedCount).toBe(2);
      expect(result.current.totalWeight).toBe(4);
      expect(result.current.completedWeight).toBe(2);
      expect(result.current.progress).toBe(50);
    });

    it("should return 0% when no tasks completed", () => {
      const tasks = [
        createMockTask({ completed: false }),
        createMockTask({ completed: false }),
      ];

      const { result } = renderHook(() => useProjectProgress(tasks, []));

      expect(result.current.progress).toBe(0);
    });

    it("should return 100% when all tasks completed", () => {
      const tasks = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
      ];

      const { result } = renderHook(() => useProjectProgress(tasks, []));

      expect(result.current.progress).toBe(100);
    });
  });

  describe("Milestones Only", () => {
    it("should calculate progress from milestones with weight = 3", () => {
      const milestones = [
        createMockMilestone({ completed: true, weight: 3 }),
        createMockMilestone({ completed: false, weight: 3 }),
      ];

      const { result } = renderHook(() => useProjectProgress([], milestones));

      expect(result.current.milestoneCount).toBe(2);
      expect(result.current.milestoneCompletedCount).toBe(1);
      expect(result.current.totalWeight).toBe(6);
      expect(result.current.completedWeight).toBe(3);
      expect(result.current.progress).toBe(50);
    });

    it("should handle milestones with custom weights", () => {
      const milestones = [
        createMockMilestone({ completed: true, weight: 5 }),
        createMockMilestone({ completed: false, weight: 5 }),
      ];

      const { result } = renderHook(() => useProjectProgress([], milestones));

      expect(result.current.totalWeight).toBe(10);
      expect(result.current.completedWeight).toBe(5);
      expect(result.current.progress).toBe(50);
    });

    it("should handle milestones with different weights", () => {
      const milestones = [
        createMockMilestone({ completed: true, weight: 1 }),
        createMockMilestone({ completed: false, weight: 9 }),
      ];

      const { result } = renderHook(() => useProjectProgress([], milestones));

      expect(result.current.totalWeight).toBe(10);
      expect(result.current.completedWeight).toBe(1);
      expect(result.current.progress).toBe(10);
    });
  });

  describe("Hybrid Progress (Tasks + Milestones)", () => {
    it("should calculate weighted progress combining tasks and milestones", () => {
      // 2 tasks (weight 1 each) + 1 milestone (weight 3)
      // Total weight = 5
      const tasks = [
        createMockTask({ completed: true }),  // weight 1
        createMockTask({ completed: false }), // weight 1
      ];
      const milestones = [
        createMockMilestone({ completed: true, weight: 3 }), // weight 3
      ];

      const { result } = renderHook(() => useProjectProgress(tasks, milestones));

      // Completed: 1 task (1) + 1 milestone (3) = 4
      // Total: 2 tasks (2) + 1 milestone (3) = 5
      // Progress: 4/5 = 80%
      expect(result.current.totalWeight).toBe(5);
      expect(result.current.completedWeight).toBe(4);
      expect(result.current.progress).toBe(80);
    });

    it("should demonstrate milestone 'Narrative Leap' effect", () => {
      // Scenario: 10 tasks + 1 milestone with weight 3
      // Completing the milestone should create significant progress jump
      const incompleteTasks = Array(10).fill(null).map(() => 
        createMockTask({ completed: false })
      );
      const milestone = createMockMilestone({ completed: false, weight: 3 });

      const { result: beforeResult } = renderHook(() => 
        useProjectProgress(incompleteTasks, [milestone])
      );

      // Before: 0/13 = 0%
      expect(beforeResult.current.progress).toBe(0);

      // Complete 1 task
      const oneTaskComplete = [
        createMockTask({ completed: true }),
        ...incompleteTasks.slice(1),
      ];
      const { result: afterOneTask } = renderHook(() => 
        useProjectProgress(oneTaskComplete, [milestone])
      );
      // After 1 task: 1/13 ≈ 8%
      expect(afterOneTask.current.progress).toBe(8);

      // Complete milestone instead of task
      const milestoneComplete = createMockMilestone({ completed: true, weight: 3 });
      const { result: afterMilestone } = renderHook(() => 
        useProjectProgress(incompleteTasks, [milestoneComplete])
      );
      // After milestone: 3/13 ≈ 23%
      expect(afterMilestone.current.progress).toBe(23);

      // Completing milestone (3 weight) provides ~3x the progress boost
    });

    it("should handle real-world project scenario", () => {
      // Project with 5 tasks and 3 milestones
      const tasks = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
        createMockTask({ completed: false }),
        createMockTask({ completed: false }),
      ];
      const milestones = [
        createMockMilestone({ completed: true, weight: 3 }),
        createMockMilestone({ completed: false, weight: 3 }),
        createMockMilestone({ completed: false, weight: 3 }),
      ];

      const { result } = renderHook(() => useProjectProgress(tasks, milestones));

      // Total weight: 5 tasks (5) + 3 milestones (9) = 14
      // Completed: 2 tasks (2) + 1 milestone (3) = 5
      // Progress: 5/14 ≈ 36%
      expect(result.current.taskCount).toBe(5);
      expect(result.current.taskCompletedCount).toBe(2);
      expect(result.current.milestoneCount).toBe(3);
      expect(result.current.milestoneCompletedCount).toBe(1);
      expect(result.current.totalWeight).toBe(14);
      expect(result.current.completedWeight).toBe(5);
      expect(result.current.progress).toBe(36);
    });
  });

  describe("Non-Task Items", () => {
    it("should ignore non-task items (habits, notes, etc.)", () => {
      const items = [
        createMockTask({ type: "habit", completed: true }),
        createMockTask({ type: "note", completed: true }),
        createMockTask({ type: "task", completed: false }),
      ];

      const { result } = renderHook(() => useProjectProgress(items, []));

      // Only the task should count
      expect(result.current.taskCount).toBe(1);
      expect(result.current.taskCompletedCount).toBe(0);
      expect(result.current.progress).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should round progress to nearest integer", () => {
      const tasks = [
        createMockTask({ completed: true }),
        createMockTask({ completed: true }),
        createMockTask({ completed: false }),
      ];

      const { result } = renderHook(() => useProjectProgress(tasks, []));

      // 2/3 = 66.67% → should round to 67%
      expect(result.current.progress).toBe(67);
    });

    it("should handle single item", () => {
      const { result: incomplete } = renderHook(() => 
        useProjectProgress([createMockTask({ completed: false })], [])
      );
      expect(incomplete.current.progress).toBe(0);

      const { result: complete } = renderHook(() => 
        useProjectProgress([createMockTask({ completed: true })], [])
      );
      expect(complete.current.progress).toBe(100);
    });

    it("should handle single milestone", () => {
      const { result: incomplete } = renderHook(() => 
        useProjectProgress([], [createMockMilestone({ completed: false })])
      );
      expect(incomplete.current.progress).toBe(0);

      const { result: complete } = renderHook(() => 
        useProjectProgress([], [createMockMilestone({ completed: true })])
      );
      expect(complete.current.progress).toBe(100);
    });
  });
});
