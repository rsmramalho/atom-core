// Empty State - Inbox Zero
// Zen-like illustration conveying peace of mind

import { Sparkles, Leaf, Check } from "lucide-react";

export function EmptyInbox() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        {/* Central zen circle */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <Check className="h-8 w-8 text-primary" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Floating elements */}
        <Sparkles 
          className="absolute -top-2 -right-2 h-5 w-5 text-amber-400 animate-pulse" 
          style={{ animationDelay: "0.2s" }}
        />
        <Leaf 
          className="absolute -bottom-1 -left-3 h-5 w-5 text-emerald-400 rotate-[-30deg]" 
        />
        <div 
          className="absolute top-4 -left-4 w-2 h-2 rounded-full bg-primary/40 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div 
          className="absolute -top-1 left-8 w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Inbox Zero 🧘
      </h3>
      <p className="text-muted-foreground text-center max-w-xs">
        Sua mente está organizada. Capture novos pensamentos quando surgirem.
      </p>

      {/* Subtle hint */}
      <p className="text-xs text-muted-foreground/60 mt-6">
        Use o campo acima para capturar ideias rapidamente
      </p>
    </div>
  );
}
