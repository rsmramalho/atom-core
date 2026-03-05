// Journal Composer - Auto-expanding textarea for reflections
// Zen-focused input with minimal distraction

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "sonner";
import { Feather, Sparkles, RefreshCw, Heart, TrendingUp, Smile, Target, Lightbulb } from "lucide-react";
import { reflectionPrompts, getRandomPrompt, getPromptsByCategory, ReflectionPrompt } from "@/lib/reflection-prompts";
import { journalContentSchema, getFirstError } from "@/lib/validation";
import { cn } from "@/lib/utils";

type PromptCategory = ReflectionPrompt["category"] | "all";

const categoryConfig: Record<PromptCategory, { label: string; icon: React.ElementType }> = {
  all: { label: "Todos", icon: Sparkles },
  gratitude: { label: "Gratidão", icon: Heart },
  growth: { label: "Crescimento", icon: TrendingUp },
  feelings: { label: "Sentimentos", icon: Smile },
  goals: { label: "Metas", icon: Target },
  learning: { label: "Aprendizado", icon: Lightbulb },
  general: { label: "Geral", icon: Sparkles },
};

function getRandomFromCategory(category: PromptCategory): ReflectionPrompt {
  if (category === "all") {
    return getRandomPrompt();
  }
  const prompts = getPromptsByCategory(category);
  const index = Math.floor(Math.random() * prompts.length);
  return prompts[index];
}

export function JournalComposer() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>("all");
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPrompt>(() => getRandomPrompt());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { createItem } = useAtomItems();

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  }, [content]);

  const shufflePrompt = () => {
    const prompts = selectedCategory === "all" 
      ? reflectionPrompts 
      : getPromptsByCategory(selectedCategory);
    
    let newPrompt = getRandomFromCategory(selectedCategory);
    // Avoid showing the same prompt twice in a row
    while (newPrompt.text === currentPrompt.text && prompts.length > 1) {
      newPrompt = getRandomFromCategory(selectedCategory);
    }
    setCurrentPrompt(newPrompt);
  };

  const handleCategoryChange = (category: PromptCategory) => {
    setSelectedCategory(category);
    setCurrentPrompt(getRandomFromCategory(category));
  };

  const usePrompt = () => {
    setContent(currentPrompt.text + "\n\n");
    textareaRef.current?.focus();
  };

  const handleSave = async () => {
    const validation = journalContentSchema.safeParse({ content });
    if (!validation.success) {
      toast.error(getFirstError(validation.error));
      return;
    }
    const trimmedContent = content.trim();

    setIsSaving(true);
    try {
      // Extract tags from content (e.g., #checkin, #mood:ansioso)
      const tagMatches = trimmedContent.match(/#[\w:]+/g) || [];
      const tags = tagMatches.map(t => t.slice(1)); // Remove #

      // Clean title (first line or first 50 chars)
      const firstLine = trimmedContent.split('\n')[0];
      const title = firstLine.length > 50 
        ? firstLine.slice(0, 50) + '...' 
        : firstLine;

      await createItem({
        title,
        type: "reflection",
        notes: trimmedContent,
        tags,
        completed: false,
        completed_at: null,
        due_date: null,
        recurrence_rule: null,
        ritual_slot: null,
        module: null,
        parent_id: null,
        project_id: null,
        checklist: [],
        project_status: null,
        progress_mode: null,
        progress: null,
        deadline: null,
        weight: 1,
        order_index: 0,
      });

      toast.success("Reflexão salva", {
        description: "Seu pensamento foi registrado.",
      });
      setContent("");
      shufflePrompt(); // New prompt for next reflection
    } catch (error) {
      toast.error("Erro ao salvar", {
        description: "Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl + Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  // Categories to show (excluding "general" from pills for cleaner UI)
  const visibleCategories: PromptCategory[] = ["all", "gratitude", "growth", "feelings", "goals", "learning"];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Prompt suggestion */}
      {!content && (
        <div className="mb-4 p-4 rounded-lg bg-muted/30 border border-border/50">
          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {visibleCategories.map((category) => {
              const config = categoryConfig[category];
              const Icon = config.icon;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {config.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/80 italic">
                "{currentPrompt.text}"
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={usePrompt}
                  className="h-7 text-xs gap-1.5"
                >
                  Usar este prompt
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={shufflePrompt}
                  className="h-7 text-xs gap-1.5 text-muted-foreground"
                >
                  <RefreshCw className="h-3 w-3" />
                  Outro
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="O que está na sua mente agora?"
          className="w-full min-h-[120px] resize-none bg-transparent border-none outline-none text-lg leading-relaxed placeholder:text-muted-foreground/50 focus:ring-0 prose prose-lg dark:prose-invert"
          disabled={isSaving}
        />
        
        {/* Subtle bottom border that appears on focus */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">⌘</kbd>
          <span className="mx-1">+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">Enter</kbd>
          <span className="ml-2">para salvar</span>
        </p>
        
        <Button
          onClick={handleSave}
          disabled={!content.trim() || isSaving}
          size="sm"
          className="gap-2"
        >
          <Feather className="h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
