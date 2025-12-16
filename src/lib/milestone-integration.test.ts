// Atom Engine 4.0 - Integration Tests
// Full flow: Milestone Creation → Progress Update
// Single Table Design validation

import { describe, it, expect } from "vitest";
import type { AtomItem } from "@/types/atom-engine";

// ============================================
// MOCK DATA FACTORIES
// ============================================

const createProject = (overrides: Partial<AtomItem> = {}): AtomItem => ({
  id: `project-${Math.random().toString(36).slice(2)}`,
  user_id: "user-123",
  title: "Test Project",
  type: "project",
  module: "work",
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
  project_status: "active",
  progress_mode: "auto",
  progress: 0,
  deadline: null,
  weight: 1,
  order_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

const createTask = (projectId: string, overrides: Partial<AtomItem> = {}): AtomItem => ({
  id: `task-${Math.random().toString(36).slice(2)}`,
  user_id: "user-123",
  title: "Test Task",
  type: "task",
  module: null,
  tags: [],
  parent_id: null,
  project_id: projectId,
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

const createMilestone = (projectId: string, overrides: Partial<AtomItem> = {}): AtomItem => ({
  id: `milestone-${Math.random().toString(36).slice(2)}`,
  user_id: "user-123",
  title: "Test Milestone",
  type: "task",
  module: null,
  tags: ["#milestone"],
  parent_id: null,
  project_id: projectId,
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
  weight: 3,
  order_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// ============================================
// BUSINESS LOGIC FUNCTIONS (mirrors actual implementation)
// ============================================

const isMilestone = (item: AtomItem): boolean => {
  return item.type === "task" && item.tags.includes("#milestone");
};

const calculateProjectProgress = (projectItems: AtomItem[]) => {
  // Filter to only tasks (includes milestones which are tasks with #milestone tag)
  const tasks = projectItems.filter(item => item.type === "task");
  
  // Separate milestones from regular tasks
  const milestones = tasks.filter(isMilestone);
  const regularTasks = tasks.filter(item => !isMilestone(item));
  
  // Calculate weighted totals
  const totalWeight = tasks.reduce((sum, t) => sum + (t.weight || 1), 0);
  const completedWeight = tasks
    .filter(t => t.completed)
    .reduce((sum, t) => sum + (t.weight || 1), 0);
  
  const progress = totalWeight > 0 
    ? Math.round((completedWeight / totalWeight) * 100) 
    : 0;
  
  return {
    progress,
    totalWeight,
    completedWeight,
    taskCount: regularTasks.length,
    taskCompletedCount: regularTasks.filter(t => t.completed).length,
    milestoneCount: milestones.length,
    milestoneCompletedCount: milestones.filter(m => m.completed).length,
  };
};

const toggleItemComplete = (item: AtomItem): AtomItem => ({
  ...item,
  completed: !item.completed,
  completed_at: !item.completed ? new Date().toISOString() : null,
  updated_at: new Date().toISOString(),
});

// ============================================
// INTEGRATION TESTS
// ============================================

describe("Integration: Milestone Creation → Progress Update Flow", () => {
  describe("Scenario 1: New Project with First Milestone", () => {
    it("should start at 0% progress with no items", () => {
      const project = createProject({ id: "project-1" });
      const projectItems: AtomItem[] = [];
      
      const progress = calculateProjectProgress(projectItems);
      
      expect(progress.progress).toBe(0);
      expect(progress.totalWeight).toBe(0);
      expect(progress.milestoneCount).toBe(0);
    });

    it("should add first milestone and remain at 0%", () => {
      const project = createProject({ id: "project-1" });
      const milestone = createMilestone(project.id, {
        title: "MVP Launch",
        weight: 3,
      });
      
      const projectItems = [milestone];
      const progress = calculateProjectProgress(projectItems);
      
      expect(progress.progress).toBe(0);
      expect(progress.milestoneCount).toBe(1);
      expect(progress.milestoneCompletedCount).toBe(0);
      expect(progress.totalWeight).toBe(3);
    });

    it("should complete milestone and reach 100%", () => {
      const project = createProject({ id: "project-1" });
      const milestone = createMilestone(project.id, {
        title: "MVP Launch",
        weight: 3,
        completed: true,
        completed_at: new Date().toISOString(),
      });
      
      const projectItems = [milestone];
      const progress = calculateProjectProgress(projectItems);
      
      expect(progress.progress).toBe(100);
      expect(progress.milestoneCompletedCount).toBe(1);
      expect(progress.completedWeight).toBe(3);
    });
  });

  describe("Scenario 2: Project with Tasks and Milestones", () => {
    it("should calculate weighted progress correctly", () => {
      const project = createProject({ id: "project-2" });
      
      // 5 tasks (weight 1 each) + 2 milestones (weight 3 each)
      // Total weight: 5 + 6 = 11
      const projectItems = [
        createTask(project.id, { title: "Task 1", completed: true }),
        createTask(project.id, { title: "Task 2", completed: true }),
        createTask(project.id, { title: "Task 3", completed: false }),
        createTask(project.id, { title: "Task 4", completed: false }),
        createTask(project.id, { title: "Task 5", completed: false }),
        createMilestone(project.id, { title: "Phase 1 Complete", weight: 3, completed: true }),
        createMilestone(project.id, { title: "Phase 2 Complete", weight: 3, completed: false }),
      ];
      
      const progress = calculateProjectProgress(projectItems);
      
      // Completed: 2 tasks (2) + 1 milestone (3) = 5
      // Total: 5 tasks (5) + 2 milestones (6) = 11
      // Progress: 5/11 = 45.45% → 45%
      expect(progress.taskCount).toBe(5);
      expect(progress.taskCompletedCount).toBe(2);
      expect(progress.milestoneCount).toBe(2);
      expect(progress.milestoneCompletedCount).toBe(1);
      expect(progress.totalWeight).toBe(11);
      expect(progress.completedWeight).toBe(5);
      expect(progress.progress).toBe(45);
    });

    it("should update progress when task is completed", () => {
      const project = createProject({ id: "project-2" });
      
      const task1 = createTask(project.id, { title: "Task 1", completed: false });
      const milestone = createMilestone(project.id, { title: "Milestone", weight: 3, completed: false });
      
      // Before: 0/4 = 0%
      const beforeItems = [task1, milestone];
      const progressBefore = calculateProjectProgress(beforeItems);
      expect(progressBefore.progress).toBe(0);
      
      // Complete task
      const completedTask = toggleItemComplete(task1);
      
      // After: 1/4 = 25%
      const afterItems = [completedTask, milestone];
      const progressAfter = calculateProjectProgress(afterItems);
      expect(progressAfter.progress).toBe(25);
    });

    it("should demonstrate 'Narrative Leap' when milestone is completed", () => {
      const project = createProject({ id: "project-2" });
      
      const tasks = Array(4).fill(null).map((_, i) => 
        createTask(project.id, { title: `Task ${i + 1}`, completed: false })
      );
      const milestone = createMilestone(project.id, { 
        title: "Major Milestone", 
        weight: 4, // High-weight milestone
        completed: false 
      });
      
      // Total weight: 4 tasks (4) + 1 milestone (4) = 8
      const items = [...tasks, milestone];
      
      // Completing 1 task = 1/8 = 12.5%
      const oneTaskComplete = [
        toggleItemComplete(tasks[0]),
        ...tasks.slice(1),
        milestone,
      ];
      const taskProgress = calculateProjectProgress(oneTaskComplete);
      expect(taskProgress.progress).toBe(13); // Rounded
      
      // Completing milestone instead = 4/8 = 50%
      const milestoneComplete = [
        ...tasks,
        toggleItemComplete(milestone),
      ];
      const milestoneProgress = calculateProjectProgress(milestoneComplete);
      expect(milestoneProgress.progress).toBe(50);
      
      // Milestone provides significant "Narrative Leap"
      expect(milestoneProgress.progress).toBeGreaterThan(taskProgress.progress * 3);
    });
  });

  describe("Scenario 3: Full Project Lifecycle", () => {
    it("should track progress from 0% to 100%", () => {
      const project = createProject({ id: "project-3" });
      
      // Initial items
      let items: AtomItem[] = [
        createTask(project.id, { id: "t1", title: "Design", completed: false }),
        createTask(project.id, { id: "t2", title: "Develop", completed: false }),
        createMilestone(project.id, { id: "m1", title: "Alpha", weight: 2, completed: false }),
        createTask(project.id, { id: "t3", title: "Test", completed: false }),
        createMilestone(project.id, { id: "m2", title: "Beta", weight: 3, completed: false }),
      ];
      // Total weight: 3 tasks (3) + 2 milestones (5) = 8
      
      // Step 1: 0%
      expect(calculateProjectProgress(items).progress).toBe(0);
      
      // Step 2: Complete "Design" → 1/8 = 12.5% → 13%
      items = items.map(i => i.id === "t1" ? toggleItemComplete(i) : i);
      expect(calculateProjectProgress(items).progress).toBe(13);
      
      // Step 3: Complete "Alpha" milestone → (1+2)/8 = 37.5% → 38%
      items = items.map(i => i.id === "m1" ? toggleItemComplete(i) : i);
      expect(calculateProjectProgress(items).progress).toBe(38);
      
      // Step 4: Complete "Develop" → (1+2+1)/8 = 50%
      items = items.map(i => i.id === "t2" ? toggleItemComplete(i) : i);
      expect(calculateProjectProgress(items).progress).toBe(50);
      
      // Step 5: Complete "Test" → (1+2+1+1)/8 = 62.5% → 63%
      items = items.map(i => i.id === "t3" ? toggleItemComplete(i) : i);
      expect(calculateProjectProgress(items).progress).toBe(63);
      
      // Step 6: Complete "Beta" milestone → 8/8 = 100%
      items = items.map(i => i.id === "m2" ? toggleItemComplete(i) : i);
      expect(calculateProjectProgress(items).progress).toBe(100);
    });

    it("should handle uncompleting items (reverting progress)", () => {
      const project = createProject({ id: "project-3" });
      
      // All completed
      let items: AtomItem[] = [
        createTask(project.id, { id: "t1", completed: true }),
        createMilestone(project.id, { id: "m1", weight: 3, completed: true }),
      ];
      
      expect(calculateProjectProgress(items).progress).toBe(100);
      
      // Uncomplete milestone
      items = items.map(i => i.id === "m1" ? toggleItemComplete(i) : i);
      expect(calculateProjectProgress(items).progress).toBe(25); // 1/4
      
      // Uncomplete task
      items = items.map(i => i.id === "t1" ? toggleItemComplete(i) : i);
      expect(calculateProjectProgress(items).progress).toBe(0);
    });
  });

  describe("Scenario 4: Variable Milestone Weights", () => {
    it("should respect different milestone weights", () => {
      const project = createProject({ id: "project-4" });
      
      const items: AtomItem[] = [
        createMilestone(project.id, { title: "Minor", weight: 1, completed: true }),
        createMilestone(project.id, { title: "Normal", weight: 3, completed: false }),
        createMilestone(project.id, { title: "Major", weight: 5, completed: false }),
        createMilestone(project.id, { title: "Critical", weight: 10, completed: false }),
      ];
      
      // Total: 19, Completed: 1
      const progress = calculateProjectProgress(items);
      expect(progress.totalWeight).toBe(19);
      expect(progress.completedWeight).toBe(1);
      expect(progress.progress).toBe(5); // 1/19 ≈ 5%
    });

    it("should show significant progress when high-weight milestone is completed", () => {
      const project = createProject({ id: "project-4" });
      
      const items: AtomItem[] = [
        createMilestone(project.id, { title: "Minor", weight: 1, completed: false }),
        createMilestone(project.id, { title: "Critical", weight: 10, completed: true }),
      ];
      
      // Total: 11, Completed: 10
      const progress = calculateProjectProgress(items);
      expect(progress.progress).toBe(91); // 10/11 ≈ 91%
    });
  });

  describe("Scenario 5: Edge Cases", () => {
    it("should handle project with only milestones", () => {
      const project = createProject({ id: "project-5" });
      
      const items: AtomItem[] = [
        createMilestone(project.id, { weight: 3, completed: true }),
        createMilestone(project.id, { weight: 3, completed: true }),
        createMilestone(project.id, { weight: 3, completed: false }),
      ];
      
      const progress = calculateProjectProgress(items);
      expect(progress.taskCount).toBe(0);
      expect(progress.milestoneCount).toBe(3);
      expect(progress.progress).toBe(67); // 6/9 ≈ 67%
    });

    it("should handle project with only tasks", () => {
      const project = createProject({ id: "project-5" });
      
      const items: AtomItem[] = [
        createTask(project.id, { completed: true }),
        createTask(project.id, { completed: true }),
        createTask(project.id, { completed: false }),
      ];
      
      const progress = calculateProjectProgress(items);
      expect(progress.milestoneCount).toBe(0);
      expect(progress.taskCount).toBe(3);
      expect(progress.progress).toBe(67); // 2/3 ≈ 67%
    });

    it("should handle single item project", () => {
      const project = createProject({ id: "project-5" });
      
      const milestone = createMilestone(project.id, { weight: 5 });
      
      expect(calculateProjectProgress([milestone]).progress).toBe(0);
      expect(calculateProjectProgress([toggleItemComplete(milestone)]).progress).toBe(100);
    });

    it("should ignore non-task items in progress calculation", () => {
      const project = createProject({ id: "project-5" });
      
      const items: AtomItem[] = [
        createTask(project.id, { completed: true }),
        { ...createTask(project.id, {}), type: "note" }, // Note - should be ignored
        { ...createTask(project.id, {}), type: "habit" }, // Habit - should be ignored
        createMilestone(project.id, { weight: 3, completed: false }),
      ];
      
      const progress = calculateProjectProgress(items);
      // Only task (1) + milestone (3) = 4 total weight
      expect(progress.totalWeight).toBe(4);
      expect(progress.progress).toBe(25); // 1/4
    });
  });

  describe("Scenario 6: Real-World Project Simulation", () => {
    it("should simulate a software development project lifecycle", () => {
      const project = createProject({ 
        id: "software-project",
        title: "E-commerce Platform",
        module: "work",
      });
      
      // Phase 1: Planning (2 tasks + 1 milestone)
      const planning = [
        createTask(project.id, { id: "p1", title: "Requirements gathering", completed: true }),
        createTask(project.id, { id: "p2", title: "Technical design", completed: true }),
        createMilestone(project.id, { id: "m1", title: "Planning Complete", weight: 2, completed: true }),
      ];
      
      // Phase 2: Development (5 tasks + 1 milestone)
      const development = [
        createTask(project.id, { id: "d1", title: "Setup infrastructure", completed: true }),
        createTask(project.id, { id: "d2", title: "User authentication", completed: true }),
        createTask(project.id, { id: "d3", title: "Product catalog", completed: true }),
        createTask(project.id, { id: "d4", title: "Shopping cart", completed: false }),
        createTask(project.id, { id: "d5", title: "Payment integration", completed: false }),
        createMilestone(project.id, { id: "m2", title: "MVP Ready", weight: 5, completed: false }),
      ];
      
      // Phase 3: Launch (2 tasks + 1 milestone)
      const launch = [
        createTask(project.id, { id: "l1", title: "QA testing", completed: false }),
        createTask(project.id, { id: "l2", title: "Deploy to production", completed: false }),
        createMilestone(project.id, { id: "m3", title: "Launch Complete", weight: 3, completed: false }),
      ];
      
      const allItems = [...planning, ...development, ...launch];
      
      // Calculate progress
      // Total: 9 tasks (9) + 3 milestones (2+5+3=10) = 19
      // Completed: 5 tasks (5) + 1 milestone (2) = 7
      // Progress: 7/19 ≈ 37%
      
      const progress = calculateProjectProgress(allItems);
      
      expect(progress.taskCount).toBe(9);
      expect(progress.taskCompletedCount).toBe(5);
      expect(progress.milestoneCount).toBe(3);
      expect(progress.milestoneCompletedCount).toBe(1);
      expect(progress.totalWeight).toBe(19);
      expect(progress.completedWeight).toBe(7);
      expect(progress.progress).toBe(37);
      
      // Verify phase completion tracking
      const planningProgress = calculateProjectProgress(planning);
      expect(planningProgress.progress).toBe(100); // Planning complete
      
      const devItems = development;
      const devProgress = calculateProjectProgress(devItems);
      // 3 tasks (3) + 0 milestones (0) = 3 of 10 total
      expect(devProgress.completedWeight).toBe(3);
    });
  });
});
