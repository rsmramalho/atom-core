import { useNavigate } from "react-router-dom";
import { FolderKanban, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { AtomItem } from "@/types/atom-engine";

interface ProjectCardProps {
  project: AtomItem & {
    calculatedProgress: number;
    totalItems: number;
    completedItems: number;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:border-primary/50 transition-colors group"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{project.title}</h3>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        {project.module && (
          <Badge variant="secondary" className="mb-3">
            {project.module}
          </Badge>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{project.calculatedProgress}%</span>
          </div>
          <Progress value={project.calculatedProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {project.completedItems} de {project.totalItems} itens completos
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
