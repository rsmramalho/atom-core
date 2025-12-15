// Module Badge Component
// Colored badge for displaying module (work, body, mind, family)

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Briefcase, Dumbbell, Brain, Users, Inbox } from "lucide-react";

export type ModuleType = "work" | "body" | "mind" | "family" | "geral" | string;

interface ModuleBadgeProps {
  module: string | null | undefined;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const MODULE_CONFIG: Record<string, { 
  label: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}> = {
  work: {
    label: "Work",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: <Briefcase className="h-3 w-3" />,
  },
  body: {
    label: "Body",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: <Dumbbell className="h-3 w-3" />,
  },
  mind: {
    label: "Mind",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: <Brain className="h-3 w-3" />,
  },
  family: {
    label: "Family",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    icon: <Users className="h-3 w-3" />,
  },
  geral: {
    label: "Geral",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-muted-foreground/30",
    icon: <Inbox className="h-3 w-3" />,
  },
};

export function ModuleBadge({ module, size = "sm", showIcon = true, className }: ModuleBadgeProps) {
  const normalizedModule = module?.toLowerCase() || "geral";
  const config = MODULE_CONFIG[normalizedModule] || MODULE_CONFIG.geral;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        config.color,
        config.bgColor,
        config.borderColor,
        size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1",
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}

// Export module options for use in selects
export const MODULE_OPTIONS = [
  { value: "work", label: "Work", icon: <Briefcase className="h-4 w-4" /> },
  { value: "body", label: "Body", icon: <Dumbbell className="h-4 w-4" /> },
  { value: "mind", label: "Mind", icon: <Brain className="h-4 w-4" /> },
  { value: "family", label: "Family", icon: <Users className="h-4 w-4" /> },
] as const;

export function getModuleConfig(module: string | null | undefined) {
  const normalizedModule = module?.toLowerCase() || "geral";
  return MODULE_CONFIG[normalizedModule] || MODULE_CONFIG.geral;
}
