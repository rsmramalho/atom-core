// Project Sheet - Work Area Pane (Tasks & Habits)
import { 
  CheckCircle2, 
  Circle, 
  ListTodo,
  Repeat,
  Sunrise,
  Sun,
  Sunset
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AtomItem, RitualSlot } from "@/types/atom-engine";

interface WorkAreaPaneProps {
  items: AtomItem[];
  onToggle: (id: string) => void;
}

const RITUAL_ICONS: Record<RitualSlot, React.ElementType> = {
  manha: Sunrise,
  meio_dia: Sun,
  noite: Sunset,
};

export function WorkAreaPane({ items, onToggle }: WorkAreaPaneProps) {
  // Filter out milestones (type='task' but with #milestone tag) - Single Table Design
  const tasks = items.filter(i => i.type === "task" && !i.tags.includes("#milestone"));
  const habits = items.filter(i => i.type === "habit");

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const pendingHabits = habits.filter(h => !h.completed);
  const completedHabits = habits.filter(h => h.completed);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Tasks Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListTodo className="h-5 w-5 text-blue-500" />
            Tasks
            <Badge variant="secondary" className="ml-auto">
              {pendingTasks.length} pendentes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendingTasks.length === 0 && completedTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma task vinculada
            </p>
          )}
          
          {pendingTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onToggle(task.id)}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate text-sm">{task.title}</span>
            </button>
          ))}

          {completedTasks.length > 0 && (
            <div className="pt-2 border-t border-border/50 space-y-1">
              <p className="text-xs text-muted-foreground">
                Completas ({completedTasks.length})
              </p>
              {completedTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onToggle(task.id)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate text-sm line-through text-muted-foreground">
                    {task.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Habits Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Repeat className="h-5 w-5 text-green-500" />
            Hábitos
            <Badge variant="secondary" className="ml-auto">
              {pendingHabits.length} pendentes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendingHabits.length === 0 && completedHabits.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum hábito vinculado
            </p>
          )}
          
          {pendingHabits.map((habit) => {
            const RitualIcon = habit.ritual_slot ? RITUAL_ICONS[habit.ritual_slot] : null;
            return (
              <button
                key={habit.id}
                onClick={() => onToggle(habit.id)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-sm flex-1">{habit.title}</span>
                {RitualIcon && (
                  <RitualIcon className="h-4 w-4 text-amber-500" />
                )}
              </button>
            );
          })}

          {completedHabits.length > 0 && (
            <div className="pt-2 border-t border-border/50 space-y-1">
              <p className="text-xs text-muted-foreground">
                Completos hoje ({completedHabits.length})
              </p>
              {completedHabits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => onToggle(habit.id)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate text-sm line-through text-muted-foreground">
                    {habit.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
