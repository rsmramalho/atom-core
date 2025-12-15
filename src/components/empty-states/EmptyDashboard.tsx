// Empty State - Dashboard Vazio
// Encouraging "free day" message

import { Coffee, CloudSun, Sparkles } from "lucide-react";

export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        {/* Main illustration */}
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/20 flex items-center justify-center shadow-sm">
          <Coffee className="h-12 w-12 text-amber-600 dark:text-amber-400" />
        </div>
        
        {/* Floating decorations */}
        <CloudSun 
          className="absolute -top-3 -right-4 h-7 w-7 text-sky-400" 
        />
        <Sparkles 
          className="absolute -bottom-2 -left-2 h-5 w-5 text-amber-400 animate-pulse" 
        />
        <div 
          className="absolute top-2 -left-3 w-2 h-2 rounded-full bg-emerald-400/60"
        />
        <div 
          className="absolute bottom-4 -right-2 w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
      </div>

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
