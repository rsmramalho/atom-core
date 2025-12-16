// Calendar Engine - Day Detail Sheet
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, CalendarDays, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CalendarItem } from "./CalendarItem";
import { OverdueSection } from "./OverdueSection";
import { cn } from "@/lib/utils";
import type { AtomItem } from "@/types/atom-engine";
import { isMilestone } from "@/hooks/useCalendarItems";

interface DayDetailSheetProps {
  date: Date | null;
  items: AtomItem[];
  overdueItems: AtomItem[];
  onClose: () => void;
  onToggle: (item: AtomItem) => void;
  onClick: (item: AtomItem) => void;
}

export function DayDetailSheet({
  date,
  items,
  overdueItems,
  onClose,
  onToggle,
  onClick,
}: DayDetailSheetProps) {
  if (!date) return null;

  const today = isToday(date);
  const milestones = items.filter(isMilestone);
  const habits = items.filter(i => i.type === "habit" && !isMilestone(i));
  const tasks = items.filter(i => i.type === "task" && !isMilestone(i));
  const others = items.filter(i => !["task", "habit"].includes(i.type) && !isMilestone(i));

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            today ? "bg-primary/20" : "bg-muted"
          )}>
            {today ? (
              <Sun className="h-5 w-5 text-primary" />
            ) : (
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg capitalize">
              {format(date, "EEEE", { locale: ptBR })}
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {/* Overdue Section - Only show on today */}
        {today && overdueItems.length > 0 && (
          <OverdueSection
            items={overdueItems}
            onToggle={onToggle}
            onClick={onClick}
          />
        )}

        {/* Empty state */}
        {items.length === 0 && (today ? overdueItems.length === 0 : true) && (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhum item agendado</p>
            <p className="text-sm">Este dia está livre</p>
          </div>
        )}

        {/* Milestones Section */}
        {milestones.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                Milestones
              </h3>
              <Badge variant="outline" className="border-amber-500/50 text-amber-600">
                {milestones.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {milestones.map((item) => (
                <CalendarItem
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onClick={onClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Habits Section */}
        {habits.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-green-600 dark:text-green-400">
                Hábitos
              </h3>
              <Badge variant="outline" className="border-green-500/50 text-green-600">
                {habits.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {habits.map((item) => (
                <CalendarItem
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onClick={onClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold">Tasks</h3>
              <Badge variant="outline">
                {tasks.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {tasks.map((item) => (
                <CalendarItem
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onClick={onClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Others Section */}
        {others.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Outros</h3>
              <Badge variant="outline">
                {others.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {others.map((item) => (
                <CalendarItem
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onClick={onClick}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
