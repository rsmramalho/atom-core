// Journal Page - Zen-focused reflection space
// Minimal distractions, focused on typography and content

import { JournalComposer, JournalFeed } from "@/components/journal";
import { BookOpen } from "lucide-react";

export default function Journal() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="pt-8 pb-12 px-6 text-center border-b border-border/30">
        <div className="flex items-center justify-center gap-3 mb-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-serif font-medium tracking-tight text-foreground">
            Diário
          </h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Um espaço para reflexões, pensamentos e momentos de clareza.
        </p>
      </header>

      {/* Main content */}
      <main className="px-6 py-12">
        {/* Composer */}
        <section className="mb-16">
          <JournalComposer />
        </section>

        {/* Divider */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Reflexões
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>
        </div>

        {/* Feed */}
        <section>
          <JournalFeed />
        </section>
      </main>
    </div>
  );
}
