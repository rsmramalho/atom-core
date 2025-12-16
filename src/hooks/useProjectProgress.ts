// Atom Engine 4.0 - Project Progress Hook (B.9/A.18)
// Hybrid Progress Engine with multiple calculation modes
// Single Table Design: All items have weight, milestones identified by #milestone tag

import { useMemo } from "react";
import type { AtomItem, ProgressMode } from "@/types/atom-engine";
import { isMilestone } from "@/types/atom-engine";

interface ProgressResult {
  progress: number;
  totalWeight: number;
  completedWeight: number;
  taskCount: number;
  taskCompletedCount: number;
  milestoneCount: number;
  milestoneCompletedCount: number;
  mode: ProgressMode;
}

interface UseProjectProgressOptions {
  mode?: ProgressMode;
  manualProgress?: number;
}

/**
 * Hybrid Progress Engine (A.18)
 * 
 * Modes:
 * - 'auto': (Tasks + Milestones) weighted progress
 * - 'milestone': Only milestones count for progress (ignores tasks)
 * - 'manual': User-defined progress value (0-100)
 */
export function useProjectProgress(
  projectItems: AtomItem[],
  options: UseProjectProgressOptions = {}
): ProgressResult {
  const { mode = "auto", manualProgress = 0 } = options;

  return useMemo(() => {
    // Separate milestones from regular tasks
    const milestones = projectItems.filter(isMilestone);
    const tasks = projectItems.filter(i => i.type === "task" && !isMilestone(i));

    // Task stats
    const taskCount = tasks.length;
    const taskCompletedCount = tasks.filter(t => t.completed).length;
    const taskWeight = tasks.reduce((sum, t) => sum + (t.weight ?? 1), 0);
    const taskCompletedWeight = tasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + (t.weight ?? 1), 0);

    // Milestone stats
    const milestoneCount = milestones.length;
    const milestoneCompletedCount = milestones.filter(m => m.completed).length;
    const milestoneWeight = milestones.reduce((sum, m) => sum + (m.weight ?? 3), 0);
    const milestoneCompletedWeight = milestones
      .filter(m => m.completed)
      .reduce((sum, m) => sum + (m.weight ?? 3), 0);

    // Calculate progress based on mode
    let progress: number;
    let totalWeight: number;
    let completedWeight: number;

    switch (mode) {
      case "manual":
        // Manual mode: use user-defined value
        progress = Math.min(100, Math.max(0, manualProgress));
        totalWeight = 100;
        completedWeight = progress;
        break;

      case "milestone":
        // Milestone-only mode: ignore tasks
        totalWeight = milestoneWeight;
        completedWeight = milestoneCompletedWeight;
        progress = totalWeight > 0
          ? Math.round((completedWeight / totalWeight) * 100)
          : 0;
        break;

      case "auto":
      default:
        // Auto mode: weighted combination of tasks + milestones
        totalWeight = taskWeight + milestoneWeight;
        completedWeight = taskCompletedWeight + milestoneCompletedWeight;
        progress = totalWeight > 0
          ? Math.round((completedWeight / totalWeight) * 100)
          : 0;
        break;
    }

    return {
      progress,
      totalWeight,
      completedWeight,
      taskCount,
      taskCompletedCount,
      milestoneCount,
      milestoneCompletedCount,
      mode,
    };
  }, [projectItems, mode, manualProgress]);
}

/**
 * Calculate progress for dashboard stats
 * Respects project status (paused projects excluded)
 */
export function calculateGlobalProgress(
  projects: AtomItem[],
  allItems: AtomItem[]
): { activeProjects: number; completedTasks: number; totalTasks: number } {
  // Only count active projects
  const activeProjects = projects.filter(
    p => p.project_status === "active"
  );

  // Get items from active projects only
  const activeProjectIds = new Set(activeProjects.map(p => p.id));
  const activeItems = allItems.filter(
    item => item.project_id && activeProjectIds.has(item.project_id) && item.type === "task"
  );

  const completedTasks = activeItems.filter(i => i.completed).length;
  const totalTasks = activeItems.length;

  return {
    activeProjects: activeProjects.length,
    completedTasks,
    totalTasks,
  };
}
