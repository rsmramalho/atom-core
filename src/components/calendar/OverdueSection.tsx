// Calendar Engine - Overdue Section Component
import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarItem } from "./CalendarItem";
import { cn } from "@/lib/utils";
import type { AtomItem } from "@/types/atom-engine";

interface OverdueSectionProps {
  items: AtomItem[];
  onToggle: (item: AtomItem) => void;
  onClick: (item: AtomItem) => void;
}

export function OverdueSection({ items, onToggle, onClick }: OverdueSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <AlertTriangle className="h-4 w-4" />
        <span className="font-semibold">Atrasados (Carry-over)</span>
        <Badge variant="destructive" className="ml-auto">
          {items.length}
        </Badge>
      </Button>

      <div
        className={cn(
          "space-y-2 pl-2 border-l-2 border-destructive/30 ml-2",
          !isExpanded && "hidden"
        )}
      >
        {items.map((item) => (
          <CalendarItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
}
