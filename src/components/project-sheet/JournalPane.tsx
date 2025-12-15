// Project Journal Pane - Reflections scoped to a project
// Displays project-specific reflections with contextual creation

import { useState } from "react";
import { useAtomItems } from "@/hooks/useAtomItems";
import { AtomItem } from "@/types/atom-engine";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Feather, Plus } from "lucide-react";
import { toast } from "sonner";

function formatReflectionDate(dateString: string): string {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return `Hoje, ${format(date, "HH:mm", { locale: ptBR })}`;
  }
  
  if (isYesterday(date)) {
    return `Ontem, ${format(date, "HH:mm", { locale: ptBR })}`;
  }
  
  return format(date, "d 'de' MMMM, HH:mm", { locale: ptBR });
}

interface JournalEntryProps {
  item: AtomItem;
  isLast: boolean;
}

function JournalEntry({ item, isLast }: JournalEntryProps) {
  // Filter out internal tags for display
  const displayTags = item.tags.filter(tag => 
    !tag.startsWith("inbox") && !tag.startsWith("macro:")
  );

  return (
    <div className="relative pl-6 pb-6 group">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[5px] top-4 bottom-0 w-px bg-border" />
      )}
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-primary bg-background group-hover:bg-primary/10 transition-colors" />
      
      {/* Content */}
      <div className="space-y-1.5">
        {/* Date */}
        <time className="text-xs text-muted-foreground">
          {formatReflectionDate(item.created_at)}
        </time>
        
        {/* Text content */}
        <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
          {item.notes || item.title}
        </p>
        
        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {displayTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] font-normal px-1.5 py-0 bg-muted/50"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface JournalPaneProps {
  projectId: string;
  projectTitle: string;
  projectModule?: string | null;
}

export function JournalPane({ projectId, projectTitle, projectModule }: JournalPaneProps) {
  const { items, isLoading, createItem } = useAtomItems();
  const [isComposing, setIsComposing] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Filter reflections for this project
  const projectReflections = (items || [])
    .filter((item) => item.type === "reflection" && item.project_id === projectId)
    .sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const handleSave = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    setIsSaving(true);
    try {
      // Extract tags from content
      const tagMatches = trimmedContent.match(/#[\w:]+/g) || [];
      const contentTags = tagMatches.map(t => t.slice(1));
      
      // Add project context tag
      const contextTags = [`project:${projectTitle.toLowerCase().replace(/\s+/g, '-')}`];
      if (projectModule) {
        contextTags.push(projectModule.toLowerCase());
      }
      
      const allTags = [...contextTags, ...contentTags];

      // Clean title
      const firstLine = trimmedContent.split('\n')[0];
      const title = firstLine.length > 50 
        ? firstLine.slice(0, 50) + '...' 
        : firstLine;

      await createItem({
        title,
        type: "reflection",
        notes: trimmedContent,
        tags: allTags,
        project_id: projectId,
        completed: false,
        completed_at: null,
        due_date: null,
        recurrence_rule: null,
        ritual_slot: null,
        module: projectModule || null,
        parent_id: null,
        checklist: [],
        project_status: null,
        progress_mode: null,
        progress: null,
        deadline: null,
        milestones: [],
        order_index: 0,
      });

      toast.success("Reflexão adicionada");
      setContent("");
      setIsComposing(false);
    } catch (error) {
      toast.error("Erro ao salvar");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="relative pl-6 pb-6">
            <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-muted bg-background" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Composer Toggle / Input */}
      {isComposing ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Decisões, ideias, bloqueios..."
              className="w-full min-h-[80px] resize-none bg-transparent border-none outline-none text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:ring-0"
              disabled={isSaving}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsComposing(false);
                  setContent("");
                }}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!content.trim() || isSaving}
                className="gap-1.5"
              >
                <Feather className="h-3.5 w-3.5" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsComposing(true)}
        >
          <Plus className="h-4 w-4" />
          Adicionar nota ou reflexão
        </Button>
      )}

      {/* Reflections List */}
      {projectReflections.length === 0 ? (
        <div className="text-center py-8 px-4">
          <Feather className="h-8 w-8 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            Nenhuma reflexão neste projeto ainda.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Registre decisões, ideias e aprendizados.
          </p>
        </div>
      ) : (
        <div className="pt-2">
          {projectReflections.map((item, index) => (
            <JournalEntry
              key={item.id}
              item={item}
              isLast={index === projectReflections.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
