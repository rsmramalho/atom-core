// Calendar Engine - Day Cell Component
import { memo } from "react";
import { 
  isToday, 
  isSameMonth, 
  format,
  isBefore,
  startOfDay
} from "date-fns";
import { Diamond } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AtomItem } from "@/types/atom-engine";
import { isMilestone } from "@/hooks/useCalendarItems";

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  items: AtomItem[];
  onSelectDate: (date: Date) => void;
  isSelected: boolean;
}

export const DayCell = memo(function DayCell({
  date,
  currentMonth,
  items,
  onSelectDate,
  isSelected,
}: DayCellProps) {
  const today = isToday(date);
  const sameMonth = isSameMonth(date, currentMonth);
  const isPast = isBefore(date, startOfDay(new Date())) && !today;
  
  const milestones = items.filter(isMilestone);
  const regularItems = items.filter(i => !isMilestone(i));
  const completedCount = items.filter(i => i.completed).length;
  const hasIncomplete = items.some(i => !i.completed);

  return (
    <button
      onClick={() => onSelectDate(date)}
      className={cn(
        "relative h-24 md:h-28 p-1 md:p-2 border border-border/50 rounded-lg transition-all text-left",
        "hover:border-primary/50 hover:bg-muted/30",
        !sameMonth && "opacity-40 bg-muted/20",
        today && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isSelected && "bg-primary/10 border-primary",
        isPast && hasIncomplete && "bg-destructive/5"
      )}
    >
      {/* Day number */}
      <div className={cn(
        "text-sm font-medium mb-1",
        today && "text-primary font-bold",
        !sameMonth && "text-muted-foreground"
      )}>
        {format(date, "d")}
      </div>

      {/* Items preview */}
      <div className="space-y-0.5 overflow-hidden max-h-16">
        {/* Milestones first - always visible */}
        {milestones.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-1 px-1 py-0.5 rounded text-[10px] truncate",
              "bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium",
              item.completed && "line-through opacity-60"
            )}
          >
            <Diamond className="h-2.5 w-2.5 fill-current flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </div>
        ))}

        {/* Regular items */}
        {regularItems.slice(0, 2 - milestones.length).map((item) => (
          <div
            key={item.id}
            className={cn(
              "px-1 py-0.5 rounded text-[10px] truncate",
              item.type === "habit" 
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-muted text-muted-foreground",
              item.completed && "line-through opacity-60"
            )}
          >
            {item.title}
          </div>
        ))}

        {/* More indicator */}
        {items.length > 2 && (
          <div className="text-[10px] text-muted-foreground px-1">
            +{items.length - 2} mais
          </div>
        )}
      </div>

      {/* Completion indicator */}
      {items.length > 0 && (
        <div className="absolute bottom-1 right-1 flex items-center gap-1">
          {completedCount > 0 && (
            <span className="text-[9px] text-muted-foreground">
              {completedCount}/{items.length}
            </span>
          )}
        </div>
      )}
    </button>
  );
});
