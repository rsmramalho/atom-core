// Calendar Engine - View Toggle Component with Keyboard Hints
import { Calendar, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarViewMode = "month" | "week";

interface CalendarViewToggleProps {
  view: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
}

export function CalendarViewToggle({ view, onViewChange }: CalendarViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted/30 p-1">
      <button
        onClick={() => onViewChange("month")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
          view === "month"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Pressione M"
      >
        <CalendarDays className="h-3.5 w-3.5" />
        Mês
        <kbd className={cn(
          "ml-1 text-[10px] px-1 py-0.5 rounded border",
          view === "month" 
            ? "border-border bg-muted/50" 
            : "border-transparent bg-transparent opacity-50"
        )}>M</kbd>
      </button>
      <button
        onClick={() => onViewChange("week")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
          view === "week"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="Pressione W"
      >
        <Calendar className="h-3.5 w-3.5" />
        Semana
        <kbd className={cn(
          "ml-1 text-[10px] px-1 py-0.5 rounded border",
          view === "week" 
            ? "border-border bg-muted/50" 
            : "border-transparent bg-transparent opacity-50"
        )}>W</kbd>
      </button>
    </div>
  );
}
