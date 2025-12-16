// Calendar Engine - Calendar Item Component
import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Diamond, CheckSquare, RefreshCw, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AtomItem } from "@/types/atom-engine";
import { isMilestone } from "@/hooks/useCalendarItems";

interface CalendarItemProps {
  item: AtomItem;
  onToggle: (item: AtomItem) => void;
  onClick: (item: AtomItem) => void;
  compact?: boolean;
}

export const CalendarItem = memo(function CalendarItem({
  item,
  onToggle,
  onClick,
  compact = false,
}: CalendarItemProps) {
  const milestone = isMilestone(item);
  const isHabit = item.type === "habit";
  const isNote = item.type === "note";

  const getIcon = () => {
    if (milestone) return <Diamond className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />;
    if (isHabit) return <RefreshCw className="h-3.5 w-3.5 text-green-500" />;
    if (isNote) return <FileText className="h-3.5 w-3.5 text-blue-500" />;
    return <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  if (compact) {
    return (
      <button
        onClick={() => onClick(item)}
        className={cn(
          "w-full text-left px-1.5 py-0.5 rounded text-xs truncate transition-colors",
          item.completed && "line-through opacity-50",
          milestone && "bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium",
          isHabit && !milestone && "bg-green-500/10 text-green-700 dark:text-green-400",
          !milestone && !isHabit && "bg-muted/50 hover:bg-muted"
        )}
      >
        <span className="flex items-center gap-1">
          {milestone && <Diamond className="h-2.5 w-2.5 fill-current" />}
          {item.title}
        </span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
        item.completed && "opacity-60",
        milestone && "border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20",
        isHabit && !milestone && "border-green-500/30 bg-green-500/5 hover:bg-green-500/10",
        !milestone && !isHabit && "border-border bg-card hover:bg-muted/50"
      )}
    >
      <Checkbox
        checked={item.completed}
        onCheckedChange={() => onToggle(item)}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          milestone && "border-amber-500 data-[state=checked]:bg-amber-500",
          isHabit && !milestone && "border-green-500 data-[state=checked]:bg-green-500"
        )}
      />

      <div 
        className="flex-1 min-w-0"
        onClick={() => onClick(item)}
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className={cn(
            "font-medium text-sm truncate",
            item.completed && "line-through"
          )}>
            {item.title}
          </span>
        </div>
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.tags.filter(t => t !== "#milestone").slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-[10px] px-1 py-0 h-4"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Milestone indicator */}
      {milestone && (
        <Badge className="bg-amber-500 text-amber-950 text-[10px]">
          Milestone
        </Badge>
      )}
    </div>
  );
});
