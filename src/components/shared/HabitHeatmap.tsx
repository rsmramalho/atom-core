// Habit Heatmap - Visual calendar showing completion history
import { useMemo, useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  subMonths,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Flame, Trophy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { calculateStreak, getLongestStreak } from "@/lib/recurrence-engine";

interface HabitHeatmapProps {
  habitTitle: string;
  completionLog: string[];
  trigger?: React.ReactNode;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function HabitHeatmap({ habitTitle, completionLog, trigger }: HabitHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const currentStreak = calculateStreak(completionLog);
  const longestStreak = getLongestStreak(completionLog);
  
  // Convert completion log to Set for fast lookup
  const completedDates = useMemo(() => {
    return new Set(completionLog.map(d => d.substring(0, 10))); // Normalize to YYYY-MM-DD
  }, [completionLog]);

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Calculate completion stats for current month
  const monthStats = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const completedInMonth = daysInMonth.filter(day => 
      completedDates.has(format(day, 'yyyy-MM-dd'))
    ).length;
    
    return {
      total: daysInMonth.length,
      completed: completedInMonth,
      percentage: Math.round((completedInMonth / daysInMonth.length) * 100)
    };
  }, [currentMonth, completedDates]);

  // Get intensity level for a day (for heatmap coloring)
  const getDayIntensity = (date: Date): 'none' | 'completed' | 'today' => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (completedDates.has(dateStr)) return 'completed';
    if (isToday(date)) return 'today';
    return 'none';
  };

  const goToPrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => subMonths(prev, -1));

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            Histórico
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-green-500" />
            {habitTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 py-2">
          <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">Streak atual</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Trophy className="h-5 w-5 text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">Maior streak</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <Calendar className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {monthStats.percentage}%
            </div>
            <div className="text-xs text-muted-foreground">Este mês</div>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between py-2">
          <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h3>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((day, i) => (
            <div 
              key={i} 
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <TooltipProvider delayDuration={200}>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const intensity = getDayIntensity(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const dateStr = format(date, 'yyyy-MM-dd');
              const isCompleted = completedDates.has(dateStr);
              
              return (
                <Tooltip key={dateStr}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "aspect-square flex items-center justify-center rounded-md text-sm transition-all cursor-default",
                        !isCurrentMonth && "opacity-30",
                        intensity === 'none' && "bg-muted/30 hover:bg-muted/50",
                        intensity === 'completed' && "bg-green-500 text-white font-medium shadow-sm hover:bg-green-600",
                        intensity === 'today' && !isCompleted && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                        isToday(date) && isCompleted && "ring-2 ring-green-400 ring-offset-1 ring-offset-background"
                      )}
                    >
                      {format(date, 'd')}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div className="font-medium">
                      {format(date, "d 'de' MMMM", { locale: ptBR })}
                    </div>
                    <div className={isCompleted ? "text-green-500" : "text-muted-foreground"}>
                      {isCompleted ? "✓ Concluído" : "Não concluído"}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Monthly Progress Bar */}
        <div className="pt-3 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso do mês</span>
            <span>{monthStats.completed} de {monthStats.total} dias</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${monthStats.percentage}%` }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-muted/50" />
            <span>Não concluído</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Concluído</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
