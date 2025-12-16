// Calendar Engine - Week Grid Component with Drag & Drop
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  isToday,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarItem } from "./CalendarItem";
import { cn } from "@/lib/utils";
import { isMilestone, type CalendarItemWithInstance } from "@/hooks/useCalendarItems";

interface WeekGridProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  itemsByDate: Record<string, CalendarItemWithInstance[]>;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onToggle: (item: CalendarItemWithInstance, instanceDate?: string) => void;
  onClick: (item: CalendarItemWithInstance) => void;
}

// Droppable day column component
function DroppableDayColumn({
  date,
  items,
  isSelected,
  onSelectDate,
  onToggle,
  onClick,
}: {
  date: Date;
  items: CalendarItemWithInstance[];
  isSelected: boolean;
  onSelectDate: (date: Date) => void;
  onToggle: (item: CalendarItemWithInstance, instanceDate?: string) => void;
  onClick: (item: CalendarItemWithInstance) => void;
}) {
  const dateKey = format(date, "yyyy-MM-dd");
  const today = isToday(date);
  
  const { isOver, setNodeRef } = useDroppable({
    id: dateKey,
    data: { date, dateKey },
  });

  // Sort items: milestones first, then habits, then tasks
  const sortedItems = [...items].sort((a, b) => {
    const aIsMilestone = isMilestone(a);
    const bIsMilestone = isMilestone(b);
    if (aIsMilestone && !bIsMilestone) return -1;
    if (!aIsMilestone && bIsMilestone) return 1;
    if (a.type === "habit" && b.type !== "habit") return -1;
    if (a.type !== "habit" && b.type === "habit") return 1;
    return 0;
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[400px] flex flex-col transition-all",
        today && "bg-primary/5",
        isOver && "bg-primary/20 ring-2 ring-inset ring-primary"
      )}
    >
      {/* Day header */}
      <button
        onClick={() => onSelectDate(date)}
        className={cn(
          "p-3 text-center border-b border-border transition-colors hover:bg-muted/50",
          isSelected && "bg-primary/10"
        )}
      >
        <div className="text-xs text-muted-foreground uppercase">
          {format(date, "EEE", { locale: ptBR })}
        </div>
        <div className={cn(
          "text-2xl font-bold mt-1",
          today && "text-primary"
        )}>
          {format(date, "d")}
        </div>
        {items.length > 0 && (
          <div className="text-[10px] text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? "item" : "itens"}
          </div>
        )}
      </button>

      {/* Items list */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {sortedItems.map((item) => (
            <CalendarItem
              key={item.id}
              item={item}
              onToggle={onToggle}
              onClick={onClick}
              compact
              draggable
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function WeekGrid({
  currentDate,
  onDateChange,
  itemsByDate,
  selectedDate,
  onSelectDate,
  onToggle,
  onClick,
}: WeekGridProps) {
  // Generate week days
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const goToPrevWeek = () => onDateChange(subWeeks(currentDate, 1));
  const goToNextWeek = () => onDateChange(addWeeks(currentDate, 1));
  const goToToday = () => onDateChange(new Date());

  // Get week range text
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekRangeText = `${format(weekStart, "d MMM", { locale: ptBR })} - ${format(weekEnd, "d MMM yyyy", { locale: ptBR })}`;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold capitalize">
            {weekRangeText}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoje
          </Button>
          <Button variant="ghost" size="icon" onClick={goToPrevWeek}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Week columns */}
      <div className="grid grid-cols-7 divide-x divide-border">
        {weekDays.map((date) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const items = itemsByDate[dateKey] || [];
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

          return (
            <DroppableDayColumn
              key={dateKey}
              date={date}
              items={items}
              isSelected={isSelected}
              onSelectDate={onSelectDate}
              onToggle={onToggle}
              onClick={onClick}
            />
          );
        })}
      </div>
    </div>
  );
}
