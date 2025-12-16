// Project Sheet - Work Area Pane (Tasks & Habits) with Tag Engine Lite (B.15)
import { 
  CheckCircle2, 
  Circle, 
  ListTodo,
  Repeat,
  Sunrise,
  Sun,
  Sunset,
  Layers
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

// Tag Engine Lite: Check if item is a section header
function isSectionHeader(item: AtomItem): boolean {
  return item.tags?.some(tag => tag.toLowerCase() === "#scope_macro") || false;
}

// Group tasks by sections (#scope_macro)
interface TaskGroup {
  section: AtomItem | null;
  tasks: AtomItem[];
}

function groupTasksBySections(tasks: AtomItem[]): TaskGroup[] {
  const groups: TaskGroup[] = [];
  let currentGroup: TaskGroup = { section: null, tasks: [] };

  // Sort by order_index to maintain user-defined order
  const sortedTasks = [...tasks].sort((a, b) => 
    (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  for (const task of sortedTasks) {
    if (isSectionHeader(task)) {
      // Save current group if it has tasks
      if (currentGroup.tasks.length > 0 || currentGroup.section) {
        groups.push(currentGroup);
      }
      // Start new section
      currentGroup = { section: task, tasks: [] };
    } else {
      currentGroup.tasks.push(task);
    }
  }

  // Don't forget the last group
  if (currentGroup.tasks.length > 0 || currentGroup.section) {
    groups.push(currentGroup);
  }

  return groups;
}

// Section Header Component
function SectionHeader({ item, onToggle }: { item: AtomItem; onToggle: (id: string) => void }) {
  return (
    <div className="flex items-center gap-2 py-2 px-1 mt-3 first:mt-0 border-b border-primary/30">
      <Layers className="h-4 w-4 text-primary" />
      <span className="font-semibold text-sm text-primary flex-1">
        {item.title.replace(/#scope_macro/gi, "").trim()}
      </span>
      {item.completed ? (
        <button onClick={() => onToggle(item.id)}>
          <CheckCircle2 className="h-4 w-4 text-primary/50" />
        </button>
      ) : (
        <button onClick={() => onToggle(item.id)}>
          <Circle className="h-4 w-4 text-primary/50" />
        </button>
      )}
    </div>
  );
}

// Task Item Component
function TaskItem({ 
  task, 
  onToggle, 
  completed = false 
}: { 
  task: AtomItem; 
  onToggle: (id: string) => void;
  completed?: boolean;
}) {
  return (
    <button
      onClick={() => onToggle(task.id)}
      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
    >
      {completed ? (
        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      <span className={`truncate text-sm ${completed ? "line-through text-muted-foreground" : ""}`}>
        {task.title}
      </span>
    </button>
  );
}

export function WorkAreaPane({ items, onToggle }: WorkAreaPaneProps) {
  // Filter out milestones (type='task' but with #milestone tag) - Single Table Design
  const tasks = items.filter(i => i.type === "task" && !i.tags.includes("#milestone"));
  const habits = items.filter(i => i.type === "habit");

  // Separate pending and completed (excluding section headers from completed count)
  const pendingTasks = tasks.filter(t => !t.completed && !isSectionHeader(t));
  const completedTasks = tasks.filter(t => t.completed && !isSectionHeader(t));
  const pendingHabits = habits.filter(h => !h.completed);
  const completedHabits = habits.filter(h => h.completed);

  // Group tasks by sections
  const taskGroups = groupTasksBySections(tasks.filter(t => !t.completed));
  const hasCompletedTasks = completedTasks.length > 0;

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
        <CardContent className="space-y-1">
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma task vinculada
            </p>
          )}
          
          {/* Render grouped tasks with sections */}
          {taskGroups.map((group, groupIndex) => (
            <div key={group.section?.id || `group-${groupIndex}`}>
              {group.section && (
                <SectionHeader item={group.section} onToggle={onToggle} />
              )}
              {group.tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} />
              ))}
            </div>
          ))}

          {/* Completed tasks section */}
          {hasCompletedTasks && (
            <div className="pt-2 border-t border-border/50 space-y-1 mt-3">
              <p className="text-xs text-muted-foreground">
                Completas ({completedTasks.length})
              </p>
              {completedTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={onToggle} 
                  completed 
                />
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
