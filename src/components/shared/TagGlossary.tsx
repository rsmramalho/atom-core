// Tag Engine Lite (B.15) - Token Glossary Component
import { useState, useEffect } from "react";
import { HelpCircle, Hash, Palette, Target, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TagCategory {
  name: string;
  icon: React.ElementType;
  color: string;
  tags: { tag: string; description: string }[];
}

const TAG_CATEGORIES: TagCategory[] = [
  {
    name: "Módulos",
    icon: Palette,
    color: "text-blue-500",
    tags: [
      { tag: "#mod_work", description: "Categoriza como Trabalho" },
      { tag: "#mod_body", description: "Categoriza como Corpo/Saúde" },
      { tag: "#mod_mind", description: "Categoriza como Mente/Estudos" },
      { tag: "#mod_family", description: "Categoriza como Família" },
    ],
  },
  {
    name: "Tipos",
    icon: Layers,
    color: "text-purple-500",
    tags: [
      { tag: "#milestone", description: "Marca como Marco do projeto (peso 3x)" },
      { tag: "#focus", description: "Adiciona ao bloco Focus do Dashboard" },
      { tag: "#inbox", description: "Item não processado (automático)" },
    ],
  },
  {
    name: "Escopo",
    icon: Target,
    color: "text-amber-500",
    tags: [
      { tag: "#scope_macro", description: "Renderiza como seção/header visual" },
      { tag: "#scope_micro", description: "Subtarefa de baixa granularidade" },
    ],
  },
  {
    name: "Temporal",
    icon: Clock,
    color: "text-green-500",
    tags: [
      { tag: "@hoje", description: "Define due_date como hoje" },
      { tag: "@amanha", description: "Define due_date como amanhã" },
      { tag: "@ritual_manha", description: "Slot ritual: manhã (aurora)" },
      { tag: "@ritual_meio_dia", description: "Slot ritual: meio-dia (zênite)" },
      { tag: "@ritual_noite", description: "Slot ritual: noite (crepúsculo)" },
    ],
  },
];

interface TagGlossaryProps {
  variant?: "icon" | "button";
  className?: string;
}

export function TagGlossary({ variant = "icon", className }: TagGlossaryProps) {
  const [open, setOpen] = useState(false);

  // Global keyboard shortcut: CMD+/ or Ctrl+/
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className={className}
            title="Glossário de Tags (⌘/)"
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className={className}>
            <HelpCircle className="h-4 w-4 mr-1" />
            Tags
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Glossário de Tags</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Use estas tags no título para aplicar efeitos automáticos
          </p>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-3 space-y-4">
            {TAG_CATEGORIES.map((category) => (
              <div key={category.name}>
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className={`h-4 w-4 ${category.color}`} />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {category.name}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {category.tags.map((item) => (
                    <div
                      key={item.tag}
                      className="flex items-start gap-2 p-1.5 rounded hover:bg-muted/50"
                    >
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs shrink-0"
                      >
                        {item.tag}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-border bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center">
            Atalho: <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">⌘/</kbd>
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
