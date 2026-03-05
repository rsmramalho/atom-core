import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectDetailSkeleton() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24">
      {/* Back button */}
      <Skeleton className="h-8 w-24" />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Skeleton className="h-8 w-8 rounded flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-7 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-9 w-14" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20 ml-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* Tab content - task list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 flex-1 max-w-[70%]" />
                <Skeleton className="h-5 w-14 rounded-full ml-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
