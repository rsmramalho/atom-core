// Calendar Engine - View Toggle Component
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
      >
        <CalendarDays className="h-3.5 w-3.5" />
        Mês
      </button>
      <button
        onClick={() => onViewChange("week")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
          view === "week"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Calendar className="h-3.5 w-3.5" />
        Semana
      </button>
    </div>
  );
}
