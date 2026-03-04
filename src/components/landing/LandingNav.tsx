import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="#hero" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <span className="font-bold text-base sm:text-lg text-foreground">MindMate</span>
          </a>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          <a href="#cta" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Começar</a>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/app">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">Entrar</Button>
          </Link>
          <Link to="/app" className="hidden sm:block">
            <Button size="sm" className="gap-2">
              Começar Grátis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/app" className="sm:hidden">
            <Button size="sm" className="px-3">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
