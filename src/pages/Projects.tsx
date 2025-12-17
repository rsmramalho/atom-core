import { useState, useMemo } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCardSkeletonGrid } from "@/components/projects/ProjectCardSkeleton";
import { MODULE_OPTIONS, getModuleConfig } from "@/components/shared/ModuleBadge";
import { 
  FolderKanban, 
  Plus, 
  Briefcase, 
  Dumbbell, 
  Brain, 
  Users, 
  LayoutGrid,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Percent,
  SortAsc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type ModuleFilter = "all" | "work" | "body" | "mind" | "family";
type SortField = "name" | "progress" | "created_at";
type SortDirection = "asc" | "desc";

const FILTER_OPTIONS: { value: ModuleFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "Todos", icon: <LayoutGrid className="h-4 w-4" /> },
  { value: "work", label: "Work", icon: <Briefcase className="h-4 w-4" /> },
  { value: "body", label: "Body", icon: <Dumbbell className="h-4 w-4" /> },
  { value: "mind", label: "Mind", icon: <Brain className="h-4 w-4" /> },
  { value: "family", label: "Family", icon: <Users className="h-4 w-4" /> },
];

const SORT_OPTIONS: { value: SortField; label: string; icon: React.ReactNode }[] = [
  { value: "name", label: "Nome", icon: <SortAsc className="h-4 w-4" /> },
  { value: "progress", label: "Progresso", icon: <Percent className="h-4 w-4" /> },
  { value: "created_at", label: "Data de Criação", icon: <Calendar className="h-4 w-4" /> },
];

export default function Projects() {
  const navigate = useNavigate();
  const { projects, isLoading } = useDashboardData();
  const [activeFilter, setActiveFilter] = useState<ModuleFilter>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filter projects by module
  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter(p => p.module?.toLowerCase() === activeFilter);
  }, [projects, activeFilter]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "name":
          comparison = a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" });
          break;
        case "progress":
          comparison = a.calculatedProgress - b.calculatedProgress;
          break;
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return sorted;
  }, [filteredProjects, sortField, sortDirection]);

  // Count projects by module
  const moduleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    MODULE_OPTIONS.forEach(({ value }) => {
      counts[value] = projects.filter(p => p.module?.toLowerCase() === value).length;
    });
    return counts;
  }, [projects]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // Set new field with default direction
      setSortField(field);
      setSortDirection(field === "name" ? "asc" : "desc");
    }
  };

  const currentSortOption = SORT_OPTIONS.find(o => o.value === sortField);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FolderKanban className="h-6 w-6 text-primary" />
              Projetos
            </h1>
            <p className="text-muted-foreground">Carregando projetos...</p>
          </div>
        </header>
        <ProjectCardSkeletonGrid count={6} />
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

      {/* Filters and Sort Controls */}
      {projects.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Module Filters */}
          <div className="flex flex-wrap gap-2">
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
                    "gap-1.5 h-7 px-2 text-xs transition-all",
                    !isActive && config && `${config.color} hover:${config.bgColor}`,
                    value === "all" && !isActive && "text-muted-foreground"
                  )}
                >
                  <span className={cn(
                    "[&>svg]:h-3 [&>svg]:w-3",
                    isActive ? "text-primary-foreground" : config?.color
                  )}>
                    {icon}
                  </span>
                  {label}
                  <span className={cn(
                    "text-[10px] px-1 py-0 rounded-full",
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

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {currentSortOption?.label}
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map(({ value, label, icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handleSort(value)}
                  className="gap-2 cursor-pointer"
                >
                  {icon}
                  {label}
                  {sortField === value && (
                    <span className="ml-auto">
                      {sortDirection === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
      ) : sortedProjects.length === 0 ? (
        <div className="text-center py-16">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-medium mb-2">Nenhum projeto neste módulo</h2>
          <p className="text-muted-foreground text-sm">
            Selecione outro filtro ou crie um novo projeto
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
