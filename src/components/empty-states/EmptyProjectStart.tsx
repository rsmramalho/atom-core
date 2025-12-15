// Empty State - New Project
// Clear CTA to create first milestone

import { Flag, Rocket, Plus, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyProjectStartProps {
  onCreateMilestone?: () => void;
  onCreateTask?: () => void;
}

export function EmptyProjectStart({ onCreateMilestone, onCreateTask }: EmptyProjectStartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        {/* Rocket launching */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
          <Rocket className="h-10 w-10 text-primary rotate-[-30deg]" />
        </div>
        
        {/* Trajectory dots */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-primary/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <div className="w-2 h-2 rounded-full bg-primary/20" />
        </div>
        
        {/* Stars */}
        <div className="absolute -top-2 right-0 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <div 
          className="absolute top-4 -right-3 w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />
        <Flag 
          className="absolute -bottom-1 -left-2 h-5 w-5 text-emerald-500" 
        />
      </div>

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
