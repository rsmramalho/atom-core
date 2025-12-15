// Empty State - Focus List
// Encouraging state to add focus items

import { Target, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function EmptyFocus() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Target className="h-8 w-8 text-primary/70" />
        </div>
        
        <Sparkles 
          className="absolute -top-1 -right-1 h-4 w-4 text-amber-400/70 animate-pulse" 
        />
      </div>

      {/* Text */}
      <h4 className="text-base font-medium text-foreground mb-1">
        Defina seu Foco
      </h4>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
        Adicione <code className="text-primary text-xs">#focus</code> a uma tarefa para ela aparecer aqui.
      </p>

      {/* CTA */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate("/inbox")}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        Ir para Inbox
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
}
