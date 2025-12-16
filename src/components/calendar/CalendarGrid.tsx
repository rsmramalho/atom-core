// Calendar Engine - Calendar Grid Component (Droppable zones only)
import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DroppableDayCell } from "./DroppableDayCell";
import type { AtomItem } from "@/types/atom-engine";

interface CalendarGridProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  itemsByDate: Record<string, AtomItem[]>;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarGrid({
  currentDate,
  onDateChange,
  itemsByDate,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const goToPrevMonth = () => onDateChange(subMonths(currentDate, 1));
  const goToNextMonth = () => onDateChange(addMonths(currentDate, 1));
  const goToToday = () => onDateChange(new Date());

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold capitalize">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoje
          </Button>
          <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {calendarDays.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const items = itemsByDate[dateKey] || [];

          return (
            <DroppableDayCell
              key={dateKey}
              date={date}
              currentMonth={currentDate}
              items={items}
              onSelectDate={onSelectDate}
              isSelected={selectedDate ? format(selectedDate, "yyyy-MM-dd") === dateKey : false}
            />
          );
        })}
      </div>
    </div>
  );
}
