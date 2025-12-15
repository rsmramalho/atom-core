import { useParams, useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { 
  ArrowLeft, 
  FolderKanban, 
  CheckCircle2, 
  Circle,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, getProjectItems, toggleComplete, isLoading } = useDashboardData();

  const project = projects.find(p => p.id === id);
  const projectItems = id ? getProjectItems(id) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto text-center">
        <p className="text-muted-foreground mb-4">Projeto não encontrado</p>
        <Button onClick={() => navigate("/projects")}>
          Voltar aos Projetos
        </Button>
      </div>
    );
  }

  const pendingItems = projectItems.filter(i => !i.completed);
  const completedItems = projectItems.filter(i => i.completed);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 -ml-2"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-start gap-3 mb-4">
          <FolderKanban className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            {project.module && (
              <Badge variant="secondary" className="mt-1">
                {project.module}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progresso Geral</span>
              <span className="text-2xl font-bold text-primary">
                {project.calculatedProgress}%
              </span>
            </div>
            <Progress value={project.calculatedProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {project.completedItems} de {project.totalItems} itens completos
            </p>
          </CardContent>
        </Card>
      </header>

      {/* Items */}
      <div className="space-y-6">
        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Circle className="h-4 w-4 text-muted-foreground" />
              Pendentes ({pendingItems.length})
            </h2>
            <div className="space-y-2">
              {pendingItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleComplete(item.id)}
                  className="flex items-center gap-3 w-full p-3 rounded-lg bg-card border hover:border-primary/50 transition-colors text-left"
                >
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs py-0">
                        {item.type}
                      </Badge>
                      {item.due_date && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.due_date).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Completos ({completedItems.length})
            </h2>
            <div className="space-y-2">
              {completedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleComplete(item.id)}
                  className="flex items-center gap-3 w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="line-through text-muted-foreground truncate">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {projectItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum item neste projeto ainda</p>
            <p className="text-sm">Adicione itens via Inbox e vincule a este projeto</p>
          </div>
        )}
      </div>
    </div>
  );
}
