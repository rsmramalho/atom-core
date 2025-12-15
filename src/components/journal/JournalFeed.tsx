// Journal Feed - Timeline of reflections
// Displays reflections in a vertical timeline style

import { useMemo } from "react";
import { useAtomItems } from "@/hooks/useAtomItems";
import { AtomItem } from "@/types/atom-engine";
import { format, isToday, isYesterday, parseISO, startOfDay, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TimePeriod } from "./JournalFilters";

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

// Highlight matching text
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

interface JournalEntryProps {
  item: AtomItem;
  isLast: boolean;
  searchQuery?: string;
}

function JournalEntry({ item, isLast, searchQuery = "" }: JournalEntryProps) {
  // Filter out internal tags for display
  const displayTags = item.tags.filter(tag => 
    !tag.startsWith("inbox") && !tag.startsWith("macro:")
  );

  const content = item.notes || item.title;

  return (
    <div className="relative pl-8 pb-8 group">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
      )}
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background group-hover:bg-primary/10 transition-colors" />
      
      {/* Content */}
      <div className="space-y-2">
        {/* Date */}
        <time className="text-sm text-muted-foreground font-medium">
          {formatReflectionDate(item.created_at)}
        </time>
        
        {/* Text content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
            {highlightText(content, searchQuery)}
          </p>
        </div>
        
        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {displayTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-normal px-2 py-0.5 bg-muted/50 hover:bg-muted"
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

function JournalFeedSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative pl-8 pb-8">
          <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-muted bg-background" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyJournal() {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-6">
        <svg
          className="w-8 h-8 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        Seu diário está vazio
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Comece a registrar seus pensamentos, reflexões e momentos importantes.
        Escreva livremente acima.
      </p>
    </div>
  );
}

interface JournalFeedProps {
  selectedTags?: string[];
  timePeriod?: TimePeriod;
  searchQuery?: string;
  onReflectionsChange?: (reflections: AtomItem[]) => void;
}

export function JournalFeed({ 
  selectedTags = [], 
  timePeriod = "all",
  searchQuery = "",
  onReflectionsChange,
}: JournalFeedProps) {
  const { items, isLoading } = useAtomItems();

  // Filter only reflections
  const allReflections = useMemo(() => {
    if (!items) return [];
    return items
      .filter((item) => item.type === "reflection")
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [items]);

  // Notify parent of all reflections (for tag extraction)
  useMemo(() => {
    onReflectionsChange?.(allReflections);
  }, [allReflections, onReflectionsChange]);

  // Apply filters
  const filteredReflections = useMemo(() => {
    let result = allReflections;

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((item) =>
        selectedTags.some((tag) => item.tags.includes(tag))
      );
    }

    // Filter by time period
    if (timePeriod !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (timePeriod) {
        case "today":
          startDate = startOfDay(now);
          break;
        case "week":
          startDate = startOfWeek(now, { locale: ptBR });
          break;
        case "month":
          startDate = startOfMonth(now);
          break;
        case "year":
          startDate = startOfYear(now);
          break;
        default:
          startDate = new Date(0);
      }

      result = result.filter((item) => 
        parseISO(item.created_at) >= startDate
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const content = (item.notes || item.title).toLowerCase();
        const tags = item.tags.join(" ").toLowerCase();
        return content.includes(query) || tags.includes(query);
      });
    }

    return result;
  }, [allReflections, selectedTags, timePeriod, searchQuery]);

  if (isLoading) {
    return <JournalFeedSkeleton />;
  }

  if (allReflections.length === 0) {
    return <EmptyJournal />;
  }

  if (filteredReflections.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-muted-foreground">
          {searchQuery 
            ? `Nenhuma reflexão encontrada para "${searchQuery}"`
            : "Nenhuma reflexão encontrada com os filtros selecionados."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {filteredReflections.map((item, index) => (
        <JournalEntry
          key={item.id}
          item={item}
          isLast={index === filteredReflections.length - 1}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}
