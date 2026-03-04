// Project Sheet (A.13/A.9/A.18) - Full project detail view with state machine and hybrid progress
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMilestones } from "@/hooks/useMilestones";
import { useProjectProgress } from "@/hooks/useProjectProgress";
import { useAtomItems } from "@/hooks/useAtomItems";
import { 
  ArrowLeft, 
  FolderKanban, 
  Loader2,
  ListTodo,
  Flag,
  BookOpen,
  Feather,
  Settings2,
  Users,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MilestonesPane } from "@/components/project-sheet/MilestonesPane";
import { WorkAreaPane } from "@/components/project-sheet/WorkAreaPane";
import { NotesPane } from "@/components/project-sheet/NotesPane";
import { JournalPane } from "@/components/project-sheet/JournalPane";
import { ActivityPane } from "@/components/project-sheet/ActivityPane";
import { ProjectStatusDropdown } from "@/components/project-sheet/ProjectStatusDropdown";
import { ProjectSettingsModal } from "@/components/project-sheet/ProjectSettingsModal";
import { EmptyProjectStart } from "@/components/empty-states";
import { ProjectFab } from "@/components/project-sheet/ProjectFab";
import { QuickAddTaskModal } from "@/components/project-sheet/QuickAddTaskModal";
import { QuickAddMilestoneModal } from "@/components/project-sheet/QuickAddMilestoneModal";
import { QuickAddListModal } from "@/components/lists";
import { ShareProjectModal } from "@/components/project-sheet/ShareProjectModal";
import { Confetti } from "@/components/shared/Confetti";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useProjectRole } from "@/hooks/useProjectRole";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { logProjectActivity } from "@/hooks/useProjectActivities";
import { cn } from "@/lib/utils";
import type { ProjectStatus, ProgressMode, ChecklistItem } from "@/types/atom-engine";

type ProjectTab = "work" | "milestones" | "notes" | "journal" | "activity";

// Progress mode labels
const PROGRESS_MODE_LABELS: Record<ProgressMode, string> = {
  auto: "Auto",
  milestone: "Milestones",
  manual: "Manual",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, items, toggleComplete, isLoading, refetch } = useDashboardData();
  const { createItem, updateItem } = useAtomItems();
  const [activeTab, setActiveTab] = useState<ProjectTab>("work");
  const { 
    milestones, 
    createMilestone, 
    updateMilestone,
    toggleComplete: toggleMilestone,
    deleteMilestone,
    isCreating: isCreatingMilestone
  } = useMilestones(id);

  // Collaboration
  const currentUser = useCurrentUser();
  const { members, ensureOwner, isOwner } = useProjectMembers(id);
  const { isViewer } = useProjectRole(id);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  
  // Celebration state
  const [showConfetti, setShowConfetti] = useState(false);

  // Get project and its items (including milestones which are items with #milestone tag)
  const project = projects.find(p => p.id === id);
  const projectItems = items.filter(item => item.project_id === id);
  
  // Derive progress mode and manual progress from project
  const progressMode: ProgressMode = project?.progress_mode || "auto";
  const manualProgress = project?.progress || 0;
  
  // Calculate progress (Single Table Design - milestones are items with #milestone tag)
  const progressData = useProjectProgress(projectItems, { mode: progressMode, manualProgress });

  // Check if project is completed (locked)
  const isProjectCompleted = project?.project_status === "completed";
  const isProjectArchived = project?.project_status === "archived";
  const isProjectPaused = project?.project_status === "paused";
  const isProjectLocked = isProjectCompleted || isProjectArchived;
  const isReadOnly = isProjectLocked || isViewer;

  // Handle status change
  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!project) return;

    try {
      await updateItem({
        id: project.id,
        project_status: newStatus,
      });

      // Trigger confetti and special toast on completion
      if (newStatus === "completed") {
        setShowConfetti(true);
        logProjectActivity(project.id, "status_changed", project.title, { new_status: "completed", user_email: currentUser?.email });
        toast.success("🎉 Projeto concluído! Parabéns pela conquista!", {
          description: "Que tal criar uma reflexão de encerramento para documentar este momento?",
          action: {
            label: "Criar Reflexão",
            onClick: () => {
              setActiveTab("journal");
            },
          },
          duration: 8000,
        });
      } else if (newStatus === "active") {
        logProjectActivity(project.id, "status_changed", project.title, { new_status: "active", user_email: currentUser?.email });
        toast.success("Projeto reativado");
      } else if (newStatus === "paused") {
        logProjectActivity(project.id, "status_changed", project.title, { new_status: "paused", user_email: currentUser?.email });
        toast.info("Projeto pausado - itens não contam para métricas globais");
      } else if (newStatus === "archived") {
        logProjectActivity(project.id, "status_changed", project.title, { new_status: "archived", user_email: currentUser?.email });
        toast.info("Projeto arquivado");
      }

      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  // Handle settings save
  const handleSettingsSave = async (newMode: ProgressMode, newManualProgress?: number) => {
    if (!project) return;

    try {
      await updateItem({
        id: project.id,
        progress_mode: newMode,
        progress: newMode === "manual" ? (newManualProgress ?? 0) : project.progress,
      });
      toast.success("Configurações salvas");
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

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

  const handleCreateMilestone = async (title: string, weight: number = 3, module: string | null = null) => {
    if (isProjectLocked) {
      toast.error("Projeto concluído não permite novas milestones");
      return;
    }
    
    try {
      await createMilestone({ 
        project_id: id!, 
        title, 
        weight,
        module: module ?? project?.module ?? null,
      });
      toast.success("Milestone criada!");
      logProjectActivity(id!, "milestone_created", title, { user_email: currentUser?.email });
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

  const handleCreateTask = async (title: string, module: string | null = null) => {
    if (isProjectLocked) {
      toast.error("Projeto concluído não permite novas tasks");
      return;
    }
    
    const finalModule = module ?? project?.module ?? null;
    try {
      await createItem({
        title,
        type: "task",
        project_id: id!,
        module: finalModule,
        tags: finalModule ? [`#${finalModule.toLowerCase()}`] : [],
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
        weight: 1,
        order_index: 0,
      });
      toast.success("Task criada!");
      logProjectActivity(id!, "task_created", title, { user_email: currentUser?.email });
    } catch (error) {
      toast.error("Erro ao criar task");
    }
  };

  const handleCreateList = async (title: string, checklist: ChecklistItem[]) => {
    if (isProjectLocked) {
      toast.error("Projeto concluído não permite novas listas");
      return;
    }
    
    const finalModule = project?.module ?? null;
    try {
      await createItem({
        title,
        type: "list",
        project_id: id!,
        module: finalModule,
        tags: finalModule ? [`#${finalModule.toLowerCase()}`] : [],
        parent_id: null,
        due_date: null,
        recurrence_rule: null,
        ritual_slot: null,
        completed: false,
        completed_at: null,
        notes: null,
        checklist,
        project_status: null,
        progress_mode: null,
        progress: null,
        deadline: null,
        weight: 1,
        order_index: 0,
      });
      toast.success("Lista criada!");
      logProjectActivity(id!, "list_created", title, { user_email: currentUser?.email });
      setListModalOpen(false);
    } catch (error) {
      toast.error("Erro ao criar lista");
    }
  };

  return (
    <div className={cn(
      "p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24 transition-opacity",
      isProjectPaused && "opacity-70"
    )}>
      {/* Confetti celebration */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

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
                <ProjectStatusDropdown
                  status={project.project_status || "active"}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          </div>
          
          {/* Share + Settings buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                // Ensure owner membership before opening share modal
                if (currentUser && project?.user_id === currentUser.id && members.length === 0) {
                  try {
                    await ensureOwner();
                  } catch (e) {
                    // Continue to open modal even if bootstrap fails
                    console.warn("ensureOwner failed:", e);
                  }
                }
                setShareModalOpen(true);
              }}
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsModalOpen(true)}
            >
              <Settings2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Progresso
                </span>
                <Badge variant="outline" className="text-xs">
                  {PROGRESS_MODE_LABELS[progressMode]}
                </Badge>
              </div>
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
              {progressMode !== "manual" && (
                <span className="ml-auto">
                  Peso: {progressData.completedWeight}/{progressData.totalWeight}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Locked project notice */}
      {isProjectLocked && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              {isProjectCompleted 
                ? "Este projeto foi concluído. Criação de novas tasks está desabilitada."
                : "Este projeto foi arquivado."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Viewer notice */}
      {isViewer && !isProjectLocked && (
        <Card className="border-blue-500/50 bg-blue-500/10">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              👁️ Você é <strong>Viewer</strong> neste projeto — somente leitura.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state when no content */}
      {projectItems.length === 0 && milestones.length === 0 ? (
        <EmptyProjectStart 
          onCreateMilestone={isReadOnly ? undefined : () => setMilestoneModalOpen(true)}
          onCreateTask={isReadOnly ? undefined : () => setTaskModalOpen(true)}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProjectTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="work" className="gap-1.5">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Trabalho</span>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="gap-1.5">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Jornada</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="gap-1.5">
              <Feather className="h-4 w-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Atividade</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="work" className="mt-0">
            <WorkAreaPane 
              items={projectItems}
              onToggle={isViewer ? () => toast.info("Somente leitura", { description: "Viewers não podem alterar itens." }) : toggleComplete}
              readOnly={isViewer}
            />
          </TabsContent>

          <TabsContent value="milestones" className="mt-0">
            <MilestonesPane
              milestones={milestones}
              onToggle={toggleMilestone}
              onCreate={isReadOnly ? undefined : handleCreateMilestone}
              onDelete={handleDeleteMilestone}
              onUpdate={handleUpdateMilestone}
              isCreating={isCreatingMilestone}
            />
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <NotesPane items={projectItems} />
          </TabsContent>

          <TabsContent value="journal" className="mt-0">
            <JournalPane 
              projectId={id!} 
              projectTitle={project.title}
              projectModule={project.module}
            />
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <ActivityPane projectId={id!} />
          </TabsContent>
        </Tabs>
      )}

      {/* FAB - Hidden when project is locked or viewer */}
      {!isReadOnly && (
        <ProjectFab
          onCreateTask={() => setTaskModalOpen(true)}
          onCreateMilestone={() => setMilestoneModalOpen(true)}
          onCreateList={() => setListModalOpen(true)}
        />
      )}

      {/* Modals */}
      <QuickAddTaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onSubmit={handleCreateTask}
        projectTitle={project.title}
        defaultModule={project.module}
      />
      <QuickAddMilestoneModal
        open={milestoneModalOpen}
        onOpenChange={setMilestoneModalOpen}
        onSubmit={handleCreateMilestone}
        projectTitle={project.title}
        defaultModule={project.module}
      />
      <QuickAddListModal
        open={listModalOpen}
        onOpenChange={setListModalOpen}
        onSave={handleCreateList}
        projectId={id}
        projectModule={project?.module ?? undefined}
      />
      <ProjectSettingsModal
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        progressMode={progressMode}
        manualProgress={manualProgress}
        onSave={handleSettingsSave}
      />
      <ShareProjectModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        projectId={id!}
        projectTitle={project.title}
      />
    </div>
  );
}
