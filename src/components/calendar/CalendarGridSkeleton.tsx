import { Skeleton } from "@/components/ui/skeleton";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarGridSkeleton() {
  // Generate 5-6 weeks of skeleton days
  const skeletonDays = Array.from({ length: 35 });

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
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

      {/* Calendar grid skeleton */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {skeletonDays.map((_, i) => (
          <div
            key={i}
            className="aspect-square p-1 rounded-lg border border-transparent"
          >
            <div className="flex flex-col h-full">
              <Skeleton className="h-4 w-4 rounded-full mb-1" />
              <div className="flex-1 space-y-0.5">
                {/* Random item indicators */}
                {Math.random() > 0.6 && (
                  <Skeleton className="h-1 w-full rounded-full" />
                )}
                {Math.random() > 0.7 && (
                  <Skeleton className="h-1 w-3/4 rounded-full" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
