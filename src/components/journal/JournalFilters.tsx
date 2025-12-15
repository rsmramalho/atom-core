// Journal Filters - Filter by tags and time period
// Minimal, zen-style filter controls

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { AtomItem } from "@/types/atom-engine";

export type TimePeriod = "all" | "today" | "week" | "month" | "year";

interface JournalFiltersProps {
  reflections: AtomItem[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
}

const timePeriodLabels: Record<TimePeriod, string> = {
  all: "Todo o período",
  today: "Hoje",
  week: "Esta semana",
  month: "Este mês",
  year: "Este ano",
};

export function JournalFilters({
  reflections,
  selectedTags,
  onTagsChange,
  timePeriod,
  onTimePeriodChange,
}: JournalFiltersProps) {
  // Extract unique tags from all reflections
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    reflections.forEach((item) => {
      item.tags.forEach((tag) => {
        // Skip internal tags
        if (!tag.startsWith("inbox") && !tag.startsWith("macro:")) {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet).sort();
  }, [reflections]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    onTagsChange([]);
    onTimePeriodChange("all");
  };

  const hasActiveFilters = selectedTags.length > 0 || timePeriod !== "all";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Time Period Filter */}
      <div className="flex items-center justify-between gap-4">
        <Select value={timePeriod} onValueChange={(v) => onTimePeriodChange(v as TimePeriod)}>
          <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(timePeriodLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            <X className="h-3 w-3" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-transparent hover:bg-muted/50 border-border/50"
                }`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Active filters summary */}
      {hasActiveFilters && (
        <p className="text-xs text-muted-foreground">
          {selectedTags.length > 0 && (
            <span>
              Filtrando por: {selectedTags.map((t) => `#${t}`).join(", ")}
            </span>
          )}
          {selectedTags.length > 0 && timePeriod !== "all" && " • "}
          {timePeriod !== "all" && (
            <span>{timePeriodLabels[timePeriod]}</span>
          )}
        </p>
      )}
    </div>
  );
}
