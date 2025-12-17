import { lazy, Suspense, ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load illustrations
export const ZenCircleIllustration = lazy(() => 
  import("./ZenCircleIllustration").then(m => ({ default: m.ZenCircleIllustration }))
);

export const FreeDayIllustration = lazy(() => 
  import("./FreeDayIllustration").then(m => ({ default: m.FreeDayIllustration }))
);

export const RocketLaunchIllustration = lazy(() => 
  import("./RocketLaunchIllustration").then(m => ({ default: m.RocketLaunchIllustration }))
);

export const TargetFocusIllustration = lazy(() => 
  import("./TargetFocusIllustration").then(m => ({ default: m.TargetFocusIllustration }))
);

// Skeleton fallback for illustrations
function IllustrationSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={`rounded-full ${className || "w-28 h-28"}`} />
  );
}

// Wrapper component that handles Suspense
interface LazyIllustrationProps {
  component: ComponentType<{ className?: string }>;
  className?: string;
}

export function LazyIllustration({ component: Component, className }: LazyIllustrationProps) {
  return (
    <Suspense fallback={<IllustrationSkeleton className={className} />}>
      <Component className={className} />
    </Suspense>
  );
}
