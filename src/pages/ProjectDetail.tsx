// Project Sheet (A.13) - Full project detail view with milestones
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMilestones } from "@/hooks/useMilestones";
import { useProjectProgress } from "@/hooks/useProjectProgress";
import { useAtomItems } from "@/hooks/useAtomItems";
import { 
  ArrowLeft, 
  FolderKanban, 
  Loader2,
  Pause,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { MilestonesPane } from "@/components/project-sheet/MilestonesPane";
import { WorkAreaPane } from "@/components/project-sheet/WorkAreaPane";
import { NotesPane } from "@/components/project-sheet/NotesPane";
import { EmptyProjectStart } from "@/components/empty-states";
import { ProjectFab } from "@/components/project-sheet/ProjectFab";
import { QuickAddTaskModal } from "@/components/project-sheet/QuickAddTaskModal";
import { QuickAddMilestoneModal } from "@/components/project-sheet/QuickAddMilestoneModal";
import { toast } from "sonner";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, items, toggleComplete, isLoading } = useDashboardData();
  const { createItem } = useAtomItems();
  const { 
    milestones, 
    createMilestone, 
    updateMilestone,
    toggleComplete: toggleMilestone,
    deleteMilestone,
    isCreating: isCreatingMilestone
  } = useMilestones(id);

  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);

  // Get project and its items
  const project = projects.find(p => p.id === id);
  const projectItems = items.filter(item => item.project_id === id);
  
  // Calculate progress with milestones
  const progressData = useProjectProgress(projectItems, milestones);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground mb-4">Projeto não encontrado</p>
        <Button onClick={() => navigate("/projects")}>
          Voltar aos Projetos
        </Button>
      </div>
    );
  }

  const handleCreateMilestone = async (title: string) => {
    try {
      await createMilestone({ project_id: id!, title });
      toast.success("Milestone criada!");
    } catch (error) {
      toast.error("Erro ao criar milestone");
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      await deleteMilestone(milestoneId);
      toast.success("Milestone removida");
    } catch (error) {
      toast.error("Erro ao remover milestone");
    }
  };

  const handleUpdateMilestone = async (milestoneId: string, updates: Partial<typeof milestones[0]>) => {
    try {
      await updateMilestone({ id: milestoneId, ...updates });
    } catch (error) {
      toast.error("Erro ao atualizar milestone");
    }
  };

  const handleCreateTask = async (title: string) => {
    try {
      await createItem({
        title,
        type: "task",
        project_id: id!,
        module: project.module,
        tags: project.module ? [`#${project.module.toLowerCase()}`] : [],
        parent_id: null,
        due_date: null,
        recurrence_rule: null,
        ritual_slot: null,
        completed: false,
        completed_at: null,
        notes: null,
        checklist: [],
        project_status: null,
        progress_mode: null,
        progress: null,
        deadline: null,
        milestones: [],
        order_index: 0,
      });
      toast.success("Task criada!");
    } catch (error) {
      toast.error("Erro ao criar task");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header & Meta */}
      <header className="space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="-ml-2"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Projetos
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <FolderKanban className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {project.module && (
                  <Badge variant="secondary">
                    {project.module}
                  </Badge>
                )}
                <Badge 
                  variant={project.project_status === "active" ? "default" : "outline"}
                  className="gap-1"
                >
                  {project.project_status === "active" ? (
                    <><Play className="h-3 w-3" /> Ativo</>
                  ) : (
                    <><Pause className="h-3 w-3" /> Pausado</>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Progresso Geral
              </span>
              <span className="text-3xl font-bold text-primary">
                {progressData.progress}%
              </span>
            </div>
            <Progress value={progressData.progress} className="h-3 mb-3" />
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>
                <strong className="text-foreground">{progressData.taskCompletedCount}</strong>
                /{progressData.taskCount} tasks
              </span>
              <span>
                <strong className="text-foreground">{progressData.milestoneCompletedCount}</strong>
                /{progressData.milestoneCount} milestones
              </span>
              <span className="ml-auto">
                Peso: {progressData.completedWeight}/{progressData.totalWeight}
              </span>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Empty state when no content */}
      {projectItems.length === 0 && milestones.length === 0 ? (
        <EmptyProjectStart 
          onCreateMilestone={() => setMilestoneModalOpen(true)}
          onCreateTask={() => setTaskModalOpen(true)}
        />
      ) : (
        <>
          {/* Jornada (Milestones) */}
          <section>
            <MilestonesPane
              milestones={milestones}
              onToggle={toggleMilestone}
              onCreate={handleCreateMilestone}
              onDelete={handleDeleteMilestone}
              onUpdate={handleUpdateMilestone}
              isCreating={isCreatingMilestone}
            />
          </section>

          {/* Mesa de Trabalho (Tasks & Habits) */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Mesa de Trabalho</h2>
            <WorkAreaPane 
              items={projectItems}
              onToggle={toggleComplete}
            />
          </section>

          {/* Notes & Resources */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Notas & Recursos</h2>
            <NotesPane items={projectItems} />
          </section>
        </>
      )}

      {/* FAB */}
      <ProjectFab
        onCreateTask={() => setTaskModalOpen(true)}
        onCreateMilestone={() => setMilestoneModalOpen(true)}
      />

      {/* Modals */}
      <QuickAddTaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onSubmit={handleCreateTask}
        projectTitle={project.title}
      />
      <QuickAddMilestoneModal
        open={milestoneModalOpen}
        onOpenChange={setMilestoneModalOpen}
        onSubmit={handleCreateMilestone}
        projectTitle={project.title}
      />
    </div>
  );
}
