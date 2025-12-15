import { Sunrise, Sun, Moon, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AtomItem, RitualSlot } from "@/types/atom-engine";

interface RitualBannerProps {
  items: AtomItem[];
  currentSlot: RitualSlot;
  onToggle: (id: string) => void;
}

const slotConfig: Record<string, { icon: typeof Sunrise; label: string; gradient: string }> = {
  manha: { 
    icon: Sunrise, 
    label: "Ritual da Manhã",
    gradient: "from-amber-500/20 to-orange-500/10"
  },
  meio_dia: { 
    icon: Sun, 
    label: "Ritual do Meio-Dia",
    gradient: "from-yellow-500/20 to-amber-500/10"
  },
  noite: { 
    icon: Moon, 
    label: "Ritual da Noite",
    gradient: "from-indigo-500/20 to-purple-500/10"
  },
};

export function RitualBanner({ items, currentSlot, onToggle }: RitualBannerProps) {
  if (!currentSlot || items.length === 0) return null;

  const config = slotConfig[currentSlot];
  const Icon = config.icon;

  return (
    <Card className={`border-primary/30 bg-gradient-to-r ${config.gradient}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {config.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-background/50 transition-colors text-left"
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
