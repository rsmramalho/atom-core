import { useState, useMemo } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { MODULE_OPTIONS, getModuleConfig } from "@/components/shared/ModuleBadge";
import { FolderKanban, Plus, Loader2, Briefcase, Dumbbell, Brain, Users, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type ModuleFilter = "all" | "work" | "body" | "mind" | "family";

const FILTER_OPTIONS: { value: ModuleFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "Todos", icon: <LayoutGrid className="h-4 w-4" /> },
  { value: "work", label: "Work", icon: <Briefcase className="h-4 w-4" /> },
  { value: "body", label: "Body", icon: <Dumbbell className="h-4 w-4" /> },
  { value: "mind", label: "Mind", icon: <Brain className="h-4 w-4" /> },
  { value: "family", label: "Family", icon: <Users className="h-4 w-4" /> },
];

export default function Projects() {
  const navigate = useNavigate();
  const { projects, isLoading } = useDashboardData();
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>("all");

  // Filter projects by module
  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter(p => p.module?.toLowerCase() === activeFilter);
  }, [projects, activeFilter]);

  // Count projects by module
  const moduleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    MODULE_OPTIONS.forEach(({ value }) => {
      counts[value] = projects.filter(p => p.module?.toLowerCase() === value).length;
    });
    return counts;
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-primary" />
            Projetos
          </h1>
          <p className="text-muted-foreground">
            {projects.length} projeto{projects.length !== 1 ? "s" : ""} ativo{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => navigate("/inbox")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Item
        </Button>
      </header>

      {/* Module Filters */}
      {projects.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(({ value, label, icon }) => {
            const config = value !== "all" ? getModuleConfig(value) : null;
            const count = moduleCounts[value] || 0;
            const isActive = activeFilter === value;
            
            return (
              <Button
                key={value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(value)}
                className={cn(
                  "gap-2 transition-all",
                  !isActive && config && `${config.color} hover:${config.bgColor}`,
                  value === "all" && !isActive && "text-muted-foreground"
                )}
              >
                <span className={cn(
                  isActive ? "text-primary-foreground" : config?.color
                )}>
                  {icon}
                </span>
                {label}
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  isActive 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <FolderKanban className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum projeto ainda</h2>
          <p className="text-muted-foreground mb-6">
            Crie projetos processando itens no Inbox
          </p>
          <Button onClick={() => navigate("/inbox")}>
            Ir para Inbox
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-medium mb-2">Nenhum projeto neste módulo</h2>
          <p className="text-muted-foreground text-sm">
            Selecione outro filtro ou crie um novo projeto
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
