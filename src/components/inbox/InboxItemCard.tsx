import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2 } from "lucide-react";
import type { AtomItem } from "@/types/atom-engine";

interface InboxItemCardProps {
  item: AtomItem;
  onProcess: (item: AtomItem) => void;
}

export function InboxItemCard({ item, onProcess }: InboxItemCardProps) {
  // Filter out #inbox tag for display
  const displayTags = item.tags.filter(tag => 
    tag.toLowerCase() !== "#inbox"
  );

  // Check for special tags
  const hasTemporalTag = displayTags.some(t => 
    t.startsWith("#due:") || item.due_date
  );
  const moduleTag = displayTags.find(t => t.startsWith("#mod_"));
  const whoTags = displayTags.filter(t => t.startsWith("#who:"));
  const whereTags = displayTags.filter(t => t.startsWith("#where:"));
  const otherTags = displayTags.filter(t => 
    !t.startsWith("#mod_") && 
    !t.startsWith("#who:") && 
    !t.startsWith("#where:")
  );

  return (
    <Card className="p-4 bg-card hover:bg-card/80 border-border transition-all hover:border-primary/30 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-medium text-foreground truncate mb-2">
            {item.title}
          </h3>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {/* Due date chip */}
            {item.due_date && (
              <Badge 
                variant="outline" 
                className="text-xs bg-accent/10 text-accent border-accent/30"
              >
                📅 {new Date(item.due_date).toLocaleDateString('pt-BR')}
              </Badge>
            )}
            
            {/* Module chip */}
            {moduleTag && (
              <Badge 
                variant="outline" 
                className="text-xs bg-primary/10 text-primary border-primary/30"
              >
                {moduleTag.replace("#mod_", "📁 ")}
              </Badge>
            )}
            
            {/* Who chips */}
            {whoTags.map(tag => (
              <Badge 
                key={tag}
                variant="outline" 
                className="text-xs bg-secondary/50 text-secondary-foreground"
              >
                {tag.replace("#who:", "👤 ")}
              </Badge>
            ))}
            
            {/* Where chips */}
            {whereTags.map(tag => (
              <Badge 
                key={tag}
                variant="outline" 
                className="text-xs bg-secondary/50 text-secondary-foreground"
              >
                {tag.replace("#where:", "📍 ")}
              </Badge>
            ))}
            
            {/* Other tags */}
            {otherTags.map(tag => (
              <Badge 
                key={tag}
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}

            {/* Ritual slot */}
            {item.ritual_slot && (
              <Badge 
                variant="outline" 
                className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/30"
              >
                {item.ritual_slot === "manha" && "🌅 Manhã"}
                {item.ritual_slot === "meio_dia" && "☀️ Meio-dia"}
                {item.ritual_slot === "noite" && "🌙 Noite"}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Process Button */}
        <Button
          onClick={() => onProcess(item)}
          variant="outline"
          size="sm"
          className="shrink-0 gap-2 opacity-70 group-hover:opacity-100 group-hover:border-primary group-hover:text-primary transition-all"
        >
          <Wand2 className="h-4 w-4" />
          Processar
        </Button>
      </div>
    </Card>
  );
}
