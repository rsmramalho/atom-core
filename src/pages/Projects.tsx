import { useDashboardData } from "@/hooks/useDashboardData";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { FolderKanban, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();
  const { projects, isLoading } = useDashboardData();

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
      <header className="mb-8 flex items-center justify-between">
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
