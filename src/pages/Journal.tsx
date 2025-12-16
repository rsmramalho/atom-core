// Journal Page - Zen-focused reflection space
// Minimal distractions, focused on typography and content

import { useState, useCallback, useRef, useEffect } from "react";
import { JournalComposer, JournalFeed, JournalFilters, TimePeriod } from "@/components/journal";
import { BookOpen, Search, X } from "lucide-react";
import { AtomItem } from "@/types/atom-engine";
import { Input } from "@/components/ui/input";

export default function Journal() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [reflections, setReflections] = useState<AtomItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleReflectionsChange = useCallback((items: AtomItem[]) => {
    setReflections(items);
  }, []);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Reflexões
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>
        </div>

        {/* Search */}
        <section className="w-full max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar reflexões..."
              className="pl-9 pr-16"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                /
              </kbd>
            )}
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <JournalFilters
            reflections={reflections}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            timePeriod={timePeriod}
            onTimePeriodChange={setTimePeriod}
          />
        </section>

        {/* Feed */}
        <section>
          <JournalFeed
            selectedTags={selectedTags}
            timePeriod={timePeriod}
            searchQuery={searchQuery}
            onReflectionsChange={handleReflectionsChange}
          />
        </section>
      </main>
    </div>
  );
}