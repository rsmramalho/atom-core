import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { generateSuggestions, type Suggestion } from "@/lib/smart-suggestions";
import type { AtomItem } from "@/types/atom-engine";

interface SmartSuggestionsProps {
  items: AtomItem[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.3, ease: "easeOut" as const },
  }),
};

export function SmartSuggestions({ items }: SmartSuggestionsProps) {
  const navigate = useNavigate();

  const suggestions = useMemo(() => generateSuggestions(items), [items]);

  if (suggestions.length === 0) return null;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
            <Lightbulb className="h-4 w-4" />
            Sugestões inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-2">
          {suggestions.map((suggestion, i) => (
            <SuggestionRow
              key={suggestion.id}
              suggestion={suggestion}
              index={i}
              onAction={() => {
                if (suggestion.action.path) {
                  navigate(suggestion.action.path);
                }
              }}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SuggestionRow({
  suggestion,
  index,
  onAction,
}: {
  suggestion: Suggestion;
  index: number;
  onAction: () => void;
}) {
  const Icon = suggestion.icon;

  return (
    <motion.button
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAction}
      className="w-full flex items-center gap-3 rounded-md p-2.5 text-left text-sm transition-colors hover:bg-accent/50 group"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-foreground/90 leading-snug">
        {suggestion.message}
      </span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
