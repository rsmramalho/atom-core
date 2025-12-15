// Atom Engine 4.0 - Project Progress Hook (B.9)
// Hybrid progress calculation: Tasks + Milestones with weights

import { useMemo } from "react";
import type { AtomItem } from "@/types/atom-engine";
import type { Milestone } from "./useMilestones";

interface ProgressResult {
  progress: number;
  totalWeight: number;
  completedWeight: number;
  taskCount: number;
  taskCompletedCount: number;
  milestoneCount: number;
  milestoneCompletedCount: number;
}

export function useProjectProgress(
  projectItems: AtomItem[],
  milestones: Milestone[]
): ProgressResult {
  return useMemo(() => {
    // Tasks weight = 1 each
    const tasks = projectItems.filter(i => i.type === "task");
    const taskCount = tasks.length;
    const taskCompletedCount = tasks.filter(t => t.completed).length;
    const taskWeight = taskCount; // Each task = 1
    const taskCompletedWeight = taskCompletedCount;

    // Milestones with variable weight
    const milestoneCount = milestones.length;
    const milestoneCompletedCount = milestones.filter(m => m.completed).length;
    const milestoneWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
    const milestoneCompletedWeight = milestones
      .filter(m => m.completed)
      .reduce((sum, m) => sum + m.weight, 0);

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
  }, [projectItems, milestones]);
}
