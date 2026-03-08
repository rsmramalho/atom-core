// Smart Suggestions Engine - Heuristic-based action suggestions
// Analyzes user data patterns to suggest 2-3 actionable next steps

import { differenceInDays, startOfWeek, isToday, isBefore, startOfDay } from "date-fns";
import type { AtomItem } from "@/types/atom-engine";
import {
  Zap,
  AlertTriangle,
  Flame,
  Trophy,
  BookOpen,
  Inbox,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface Suggestion {
  id: string;
  icon: LucideIcon;
  message: string;
  action: { label: string; path?: string; itemId?: string };
  priority: number;
}

const MAX_SUGGESTIONS = 3;

export function generateSuggestions(items: AtomItem[]): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const now = new Date();
  const today = startOfDay(now);

  // 1. Overdue tasks — oldest first
  const overdue = items.filter(
    (i) =>
      !i.completed &&
      i.type === "task" &&
      i.due_date &&
      isBefore(startOfDay(new Date(i.due_date)), today)
  );
  if (overdue.length > 0) {
    const oldest = overdue.sort(
      (a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
    )[0];
    const daysLate = differenceInDays(today, new Date(oldest.due_date!));
    suggestions.push({
      id: "overdue",
      icon: AlertTriangle,
      message:
        overdue.length === 1
          ? `"${oldest.title}" está ${daysLate}d atrasada — resolva agora!`
          : `${overdue.length} tarefas atrasadas — comece pela mais antiga: "${oldest.title}"`,
      action: { label: "Ver atrasadas", path: "/" },
      priority: 90 + Math.min(overdue.length * 2, 10),
    });
  }

  // 2. Habit streaks — encourage continuation
  const habits = items.filter((i) => i.type === "habit" && !i.completed);
  for (const habit of habits) {
    const log = habit.completion_log || [];
    if (log.length >= 3) {
      // Check consecutive recent days
      const streak = calculateStreak(log);
      if (streak >= 3) {
        const todayDone = log.some((d) => isToday(new Date(d)));
        if (!todayDone) {
          suggestions.push({
            id: `streak-${habit.id}`,
            icon: Flame,
            message: `"${habit.title}" tem streak de ${streak} dias — não quebre hoje!`,
            action: { label: "Ir ao Ritual", path: "/ritual" },
            priority: 70 + Math.min(streak, 20),
          });
        }
      }
    }
  }

  // 3. Projects near completion
  const activeProjects = items.filter(
    (i) => i.type === "project" && i.project_status === "active"
  );
  for (const project of activeProjects) {
    const projectItems = items.filter((i) => i.project_id === project.id);
    if (projectItems.length === 0) continue;
    const completed = projectItems.filter((i) => i.completed).length;
    const pct = Math.round((completed / projectItems.length) * 100);
    const remaining = projectItems.length - completed;
    if (pct >= 70 && remaining > 0 && remaining <= 5) {
      suggestions.push({
        id: `project-${project.id}`,
        icon: Trophy,
        message: `"${project.title}" está em ${pct}% — faltam só ${remaining} itens!`,
        action: { label: "Abrir projeto", path: `/projects/${project.id}` },
        priority: 60 + pct / 5,
      });
    }
  }

  // 4. No reflections this week
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const reflectionsThisWeek = items.filter(
    (i) =>
      i.type === "reflection" &&
      new Date(i.created_at) >= weekStart
  );
  if (reflectionsThisWeek.length === 0) {
    suggestions.push({
      id: "journal",
      icon: BookOpen,
      message: "Nenhuma reflexão esta semana — escreva uma no Journal",
      action: { label: "Abrir Journal", path: "/journal" },
      priority: 40,
    });
  }

  // 5. Focus items stale (no update in 3+ days)
  const focusItems = items.filter(
    (i) =>
      !i.completed &&
      i.tags?.some((t) => t.toLowerCase() === "#focus") &&
      i.type !== "project"
  );
  const staleFocus = focusItems.filter(
    (i) => differenceInDays(now, new Date(i.updated_at)) >= 3
  );
  if (staleFocus.length > 0) {
    suggestions.push({
      id: "stale-focus",
      icon: Target,
      message: `"${staleFocus[0].title}" com #focus parada há ${differenceInDays(now, new Date(staleFocus[0].updated_at))} dias`,
      action: { label: "Revisar foco", path: "/" },
      priority: 55,
    });
  }

  // 6. Inbox overload (many items without project or due_date)
  const inboxItems = items.filter(
    (i) =>
      !i.completed &&
      i.type === "task" &&
      !i.project_id &&
      !i.due_date &&
      !i.parent_id
  );
  if (inboxItems.length >= 5) {
    suggestions.push({
      id: "inbox-overload",
      icon: Inbox,
      message: `${inboxItems.length} itens soltos na Inbox — organize com datas ou projetos`,
      action: { label: "Ir à Inbox", path: "/inbox" },
      priority: 45 + Math.min(inboxItems.length, 10),
    });
  }

  // Sort by priority descending and return top N
  return suggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, MAX_SUGGESTIONS);
}

function calculateStreak(completionLog: string[]): number {
  if (completionLog.length === 0) return 0;

  const dates = completionLog
    .map((d) => startOfDay(new Date(d)).getTime())
    .filter((v, i, a) => a.indexOf(v) === i) // unique
    .sort((a, b) => b - a); // newest first

  const oneDay = 86400000;
  let streak = 1;

  for (let i = 0; i < dates.length - 1; i++) {
    if (dates[i] - dates[i + 1] === oneDay) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
