// Empty State - New Project
// Clear CTA to create first milestone

import { Suspense } from "react";
import { Flag, Plus, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RocketLaunchIllustration } from "./illustrations";

interface EmptyProjectStartProps {
  onCreateMilestone?: () => void;
  onCreateTask?: () => void;
}

export function EmptyProjectStart({ onCreateMilestone, onCreateTask }: EmptyProjectStartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      {/* Custom SVG Illustration */}
      <Suspense fallback={<Skeleton className="w-28 h-28 rounded-full mb-4" />}>
        <RocketLaunchIllustration className="w-28 h-28 mb-4" />
      </Suspense>

      {/* Text */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Projeto Pronto para Decolar! 🚀
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Comece definindo marcos importantes ou adicione suas primeiras tarefas.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        {onCreateMilestone && (
          <Button 
            onClick={onCreateMilestone}
            className="flex-1 gap-2"
            variant="default"
          >
            <Flag className="h-4 w-4" />
            Criar Milestone
          </Button>
        )}
        {onCreateTask && (
          <Button 
            onClick={onCreateTask}
            className="flex-1 gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Adicionar Task
          </Button>
        )}
      </div>

      {/* Hint */}
      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/60">
        <ArrowDown className="h-3 w-3 animate-bounce" />
        <span>Ou use o botão flutuante abaixo</span>
      </div>
    </div>
  );
}
