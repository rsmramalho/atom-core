// Empty State - Focus List
// Encouraging state to add focus items

import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TargetFocusIllustration } from "./illustrations";

export function EmptyFocus() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 animate-fade-in">
      {/* Custom SVG Illustration */}
      <Suspense fallback={<Skeleton className="w-20 h-20 rounded-full mb-4" />}>
        <TargetFocusIllustration className="w-20 h-20 mb-4" />
      </Suspense>

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
