// Journal Composer - Auto-expanding textarea for reflections
// Zen-focused input with minimal distraction

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "sonner";
import { Feather } from "lucide-react";

export function JournalComposer() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

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
        milestones: [],
        order_index: 0,
      });

      toast.success("Reflexão salva", {
        description: "Seu pensamento foi registrado.",
      });
      setContent("");
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

  return (
    <div className="w-full max-w-2xl mx-auto">
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
