import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border/50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
          <span className="font-semibold text-foreground/80">MindMate</span>
          <span className="text-muted-foreground text-sm">v4.0.0</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidade</Link>
          <Link to="/install" className="hover:text-foreground transition-colors">Instalar App</Link>
        </div>
      </div>
    </footer>
  );
}
