// Empty State - Dashboard Vazio
// Encouraging "free day" message

import { Suspense } from "react";
import { FreeDayIllustration } from "./illustrations";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Custom SVG Illustration */}
      <Suspense fallback={<Skeleton className="w-36 h-36 rounded-full mb-4" />}>
        <FreeDayIllustration className="w-36 h-36 mb-4" />
      </Suspense>

      {/* Text */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Dia Livre! ☀️
      </h3>
      <p className="text-muted-foreground text-center max-w-xs">
        Nenhuma tarefa pendente para hoje. Aproveite para relaxar ou explorar novos projetos.
      </p>

      {/* Motivational note */}
      <div className="mt-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
        Você está em dia!
      </div>
    </div>
  );
}
