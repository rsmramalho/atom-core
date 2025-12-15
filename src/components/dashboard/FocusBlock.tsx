import { Target, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AtomItem } from "@/types/atom-engine";

interface FocusBlockProps {
  items: AtomItem[];
  onToggle: (id: string) => void;
}

export function FocusBlock({ items, onToggle }: FocusBlockProps) {
  if (items.length === 0) return null;

  return (
    <Card className="border-primary bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Foco
          <Badge variant="secondary" className="ml-auto">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="flex items-center gap-3 w-full p-3 rounded-lg bg-background/50 hover:bg-background transition-colors text-left"
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-primary flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                  {item.title}
                </p>
                {item.due_date && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.due_date).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
