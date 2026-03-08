import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateSuggestions, type Suggestion } from "@/lib/smart-suggestions";
import type { AtomItem } from "@/types/atom-engine";

interface SmartSuggestionsProps {
  items: AtomItem[];
}

export function SmartSuggestions({ items }: SmartSuggestionsProps) {
  const navigate = useNavigate();

  const suggestions = useMemo(() => generateSuggestions(items), [items]);

  if (suggestions.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
          <Lightbulb className="h-4 w-4" />
          Sugestões inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-2">
        {suggestions.map((suggestion) => (
          <SuggestionRow
            key={suggestion.id}
            suggestion={suggestion}
            onAction={() => {
              if (suggestion.action.path) {
                navigate(suggestion.action.path);
              }
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function SuggestionRow({
  suggestion,
  onAction,
}: {
  suggestion: Suggestion;
  onAction: () => void;
}) {
  const Icon = suggestion.icon;

  return (
    <button
      onClick={onAction}
      className="w-full flex items-center gap-3 rounded-md p-2.5 text-left text-sm transition-colors hover:bg-accent/50 group"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-foreground/90 leading-snug">
        {suggestion.message}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
