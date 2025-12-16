// Atom Engine 4.0 - Project Progress Hook (B.9)
// Single Table Design: All items have weight, milestones identified by #milestone tag

import { useMemo } from "react";
import type { AtomItem } from "@/types/atom-engine";
import { isMilestone } from "@/types/atom-engine";

interface ProgressResult {
  progress: number;
  totalWeight: number;
  completedWeight: number;
  taskCount: number;
  taskCompletedCount: number;
  milestoneCount: number;
  milestoneCompletedCount: number;
}

export function useProjectProgress(projectItems: AtomItem[]): ProgressResult {
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

    // Total weighted progress
    const totalWeight = taskWeight + milestoneWeight;
    const completedWeight = taskCompletedWeight + milestoneCompletedWeight;
    
    const progress = totalWeight > 0 
      ? Math.round((completedWeight / totalWeight) * 100)
      : 0;

    return {
      progress,
      totalWeight,
      completedWeight,
      taskCount,
      taskCompletedCount,
      milestoneCount,
      milestoneCompletedCount,
    };
  }, [projectItems]);
}
