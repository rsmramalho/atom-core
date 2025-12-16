// Calendar Engine - Filters Component
import { Diamond, CheckSquare, RefreshCw, Briefcase, Heart, Brain, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ItemTypeFilter = "all" | "task" | "habit" | "milestone";
export type ModuleFilter = "all" | "work" | "body" | "mind" | "family" | "geral";

interface CalendarFiltersProps {
  typeFilter: ItemTypeFilter;
  moduleFilter: ModuleFilter;
  onTypeChange: (type: ItemTypeFilter) => void;
  onModuleChange: (module: ModuleFilter) => void;
}

const TYPE_OPTIONS: { value: ItemTypeFilter; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "all", label: "Todos", icon: <Sparkles className="h-3.5 w-3.5" />, color: "" },
  { value: "task", label: "Tasks", icon: <CheckSquare className="h-3.5 w-3.5" />, color: "text-foreground" },
  { value: "milestone", label: "Milestones", icon: <Diamond className="h-3.5 w-3.5" />, color: "text-amber-500" },
  { value: "habit", label: "Hábitos", icon: <RefreshCw className="h-3.5 w-3.5" />, color: "text-green-500" },
];

const MODULE_OPTIONS: { value: ModuleFilter; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "all", label: "Todos", icon: <Sparkles className="h-3.5 w-3.5" />, color: "" },
  { value: "work", label: "Work", icon: <Briefcase className="h-3.5 w-3.5" />, color: "text-blue-500" },
  { value: "body", label: "Body", icon: <Heart className="h-3.5 w-3.5" />, color: "text-red-500" },
  { value: "mind", label: "Mind", icon: <Brain className="h-3.5 w-3.5" />, color: "text-purple-500" },
  { value: "family", label: "Family", icon: <Users className="h-3.5 w-3.5" />, color: "text-orange-500" },
  { value: "geral", label: "Geral", icon: <Sparkles className="h-3.5 w-3.5" />, color: "text-muted-foreground" },
];

export function CalendarFilters({
  typeFilter,
  moduleFilter,
  onTypeChange,
  onModuleChange,
}: CalendarFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Type Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">Tipo:</span>
        <div className="flex flex-wrap gap-1">
          {TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onTypeChange(option.value)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                typeFilter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className={typeFilter !== option.value ? option.color : ""}>
                {option.icon}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Module Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">Módulo:</span>
        <div className="flex flex-wrap gap-1">
          {MODULE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onModuleChange(option.value)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                moduleFilter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className={moduleFilter !== option.value ? option.color : ""}>
                {option.icon}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters indicator */}
      {(typeFilter !== "all" || moduleFilter !== "all") && (
        <Badge 
          variant="secondary" 
          className="text-xs cursor-pointer hover:bg-destructive/20"
          onClick={() => {
            onTypeChange("all");
            onModuleChange("all");
          }}
        >
          Limpar filtros
        </Badge>
      )}
    </div>
  );
}
