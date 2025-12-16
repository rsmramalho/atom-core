// Streak Badge Component - Displays consecutive completion days for habits
import { Flame, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { calculateStreak, getLongestStreak } from "@/lib/recurrence-engine";

interface StreakBadgeProps {
  completionLog: string[];
  className?: string;
  showTooltip?: boolean;
  compact?: boolean;
}

export function StreakBadge({ 
  completionLog, 
  className,
  showTooltip = true,
  compact = false
}: StreakBadgeProps) {
  const currentStreak = calculateStreak(completionLog);
  const longestStreak = getLongestStreak(completionLog);
  
  // Don't show if no streak
  if (currentStreak === 0 && longestStreak === 0) return null;

  // Determine streak level for styling
  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return "legendary"; // 30+ days
    if (streak >= 14) return "epic";      // 14+ days
    if (streak >= 7) return "great";      // 7+ days
    if (streak >= 3) return "good";       // 3+ days
    return "starter";                      // 1-2 days
  };

  const level = getStreakLevel(currentStreak);
  
  const levelStyles = {
    legendary: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400",
    epic: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400",
    great: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400",
    good: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30",
    starter: "bg-muted text-muted-foreground border-border",
  };

  const Icon = level === "legendary" ? Trophy : level === "epic" ? Zap : Flame;

  const badge = (
    <Badge 
      variant="outline"
      className={cn(
        "font-semibold flex items-center gap-1 shrink-0 transition-all",
        levelStyles[level],
        compact ? "text-[10px] px-1.5 py-0" : "text-xs px-2 py-0.5",
        currentStreak > 0 && "animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      <Icon className={cn(
        "shrink-0",
        compact ? "h-2.5 w-2.5" : "h-3 w-3",
        level === "legendary" && "animate-pulse"
      )} />
      {currentStreak > 0 ? (
        <span>{currentStreak}</span>
      ) : longestStreak > 0 ? (
        <span className="opacity-60">—</span>
      ) : null}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-popover border border-border shadow-lg"
        >
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>
                Streak atual: <strong>{currentStreak} {currentStreak === 1 ? "dia" : "dias"}</strong>
              </span>
            </div>
            {longestStreak > currentStreak && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span>
                  Maior streak: <strong>{longestStreak} dias</strong>
                </span>
              </div>
            )}
            {currentStreak === longestStreak && currentStreak > 0 && (
              <div className="text-amber-500 font-medium flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Recorde pessoal!
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
