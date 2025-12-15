import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  RefreshCw, 
  FileText, 
  FolderKanban,
  Plus,
  Lightbulb,
  Sparkles,
  Sunrise,
  Sun,
  Sunset,
  Briefcase,
  Dumbbell,
  Brain,
  Users
} from "lucide-react";
import type { RitualSlot } from "@/types/atom-engine";
import type { AtomItem, ItemType } from "@/types/atom-engine";
import { MODULE_OPTIONS, getModuleConfig } from "@/components/shared/ModuleBadge";

interface MacroPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: AtomItem | null;
  projects: AtomItem[];
  onPromote: (itemId: string, projectId: string, projectName: string, type: ItemType, ritualSlot?: RitualSlot, module?: string) => void;
  onCreateProject: (name: string, module: string | null) => Promise<AtomItem | undefined>;
}

const TYPE_OPTIONS: { value: ItemType; label: string; icon: React.ReactNode }[] = [
  { value: "task", label: "Tarefa", icon: <CheckSquare className="h-4 w-4" /> },
  { value: "habit", label: "Hábito", icon: <RefreshCw className="h-4 w-4" /> },
  { value: "note", label: "Nota", icon: <FileText className="h-4 w-4" /> },
  { value: "project", label: "Projeto", icon: <FolderKanban className="h-4 w-4" /> },
];

const RITUAL_SLOT_OPTIONS: { value: RitualSlot | "none"; label: string; icon: React.ReactNode }[] = [
  { value: "none", label: "Sem ritual", icon: null },
  { value: "manha", label: "Manhã", icon: <Sunrise className="h-4 w-4 text-amber-500" /> },
  { value: "meio_dia", label: "Meio-dia", icon: <Sun className="h-4 w-4 text-yellow-500" /> },
  { value: "noite", label: "Noite", icon: <Sunset className="h-4 w-4 text-purple-500" /> },
];

const MODULE_ICONS: Record<string, React.ReactNode> = {
  work: <Briefcase className="h-4 w-4 text-blue-500" />,
  body: <Dumbbell className="h-4 w-4 text-orange-500" />,
  mind: <Brain className="h-4 w-4 text-purple-500" />,
  family: <Users className="h-4 w-4 text-rose-500" />,
};

export function MacroPickerModal({
  open,
  onOpenChange,
  item,
  projects,
  onPromote,
  onCreateProject,
}: MacroPickerModalProps) {
  const [selectedType, setSelectedType] = useState<ItemType>("task");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedRitualSlot, setSelectedRitualSlot] = useState<RitualSlot | "none">("none");
  const [selectedModule, setSelectedModule] = useState<string>("geral");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectModule, setNewProjectModule] = useState<string>("work");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract module from item tags if present
  const itemModule = useMemo(() => {
    if (!item) return null;
    if (item.module) return item.module;
    const modTag = item.tags.find(t => t.startsWith("#mod_"));
    return modTag ? modTag.replace("#mod_", "") : null;
  }, [item]);

  // Filter and sort projects - suggest matching module first
  const sortedProjects = useMemo(() => {
    if (!itemModule) return projects;
    
    return [...projects].sort((a, b) => {
      const aHasModule = a.module === itemModule || a.tags.some(t => t === `#mod_${itemModule}`);
      const bHasModule = b.module === itemModule || b.tags.some(t => t === `#mod_${itemModule}`);
      
      if (aHasModule && !bHasModule) return -1;
      if (!aHasModule && bHasModule) return 1;
      return 0;
    });
  }, [projects, itemModule]);

  // Suggested projects (matching module)
  const suggestedProjects = useMemo(() => {
    if (!itemModule) return [];
    return projects.filter(p => 
      p.module === itemModule || p.tags.some(t => t === `#mod_${itemModule}`)
    );
  }, [projects, itemModule]);

  // Get selected project
  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Auto-inherit module from selected project
  useEffect(() => {
    if (selectedProject?.module) {
      setSelectedModule(selectedProject.module);
    }
  }, [selectedProject]);

  // Reset state when modal opens with new item
  useEffect(() => {
    if (open && item) {
      setSelectedType(item.type !== "project" ? item.type : "task");
      setSelectedProjectId("");
      setSelectedRitualSlot(item.ritual_slot || "none");
      setSelectedModule(itemModule || "geral");
      setIsCreatingProject(false);
      setNewProjectName("");
      setNewProjectModule("work");
    }
  }, [open, item?.id, itemModule]);

  const handleConfirm = async () => {
    if (!item) return;
    
    setIsSubmitting(true);
    
    try {
      const ritualSlot = selectedType === "habit" && selectedRitualSlot !== "none" 
        ? selectedRitualSlot 
        : undefined;

      // Ensure module is never null
      const finalModule = selectedModule || "geral";

      if (selectedType === "project") {
        // Converting item to a standalone project - module is required
        onPromote(item.id, "", item.title, "project", undefined, newProjectModule || "work");
        onOpenChange(false);
      } else if (isCreatingProject && newProjectName.trim()) {
        // Create new project first with module
        const newProject = await onCreateProject(newProjectName.trim(), newProjectModule);
        if (newProject) {
          onPromote(item.id, newProject.id, newProject.title, selectedType, ritualSlot, newProjectModule);
          onOpenChange(false);
        }
      } else if (selectedProjectId) {
        const project = projects.find(p => p.id === selectedProjectId);
        if (project) {
          onPromote(item.id, selectedProjectId, project.title, selectedType, ritualSlot, finalModule);
          onOpenChange(false);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canConfirm = selectedProjectId || (isCreatingProject && newProjectName.trim());

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Macro Picker
          </DialogTitle>
          <DialogDescription>
            Transforme "{item.title}" em um item organizado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type Selection */}
          <div className="space-y-3">
            <Label>Tipo do Item</Label>
            <div className="grid grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(({ value, label, icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant={selectedType === value ? "default" : "outline"}
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={() => setSelectedType(value)}
                >
                  {icon}
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Ritual Slot Selection - Only show for habits */}
          {selectedType === "habit" && (
            <div className="space-y-3">
              <Label>Ritual (opcional)</Label>
              <div className="grid grid-cols-4 gap-2">
                {RITUAL_SLOT_OPTIONS.map(({ value, label, icon }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={selectedRitualSlot === value ? "default" : "outline"}
                    className="flex flex-col gap-1 h-auto py-3"
                    onClick={() => setSelectedRitualSlot(value)}
                  >
                    {icon || <span className="h-4 w-4" />}
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Hábitos com ritual aparecem na Ritual View do período selecionado.
              </p>
            </div>
          )}

          {/* Module Selection - When converting to project */}
          {selectedType === "project" && (
            <div className="space-y-3">
              <Label>Módulo <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-4 gap-2">
                {MODULE_OPTIONS.map(({ value, label, icon }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={newProjectModule === value ? "default" : "outline"}
                    className="flex flex-col gap-1 h-auto py-3"
                    onClick={() => setNewProjectModule(value)}
                  >
                    {MODULE_ICONS[value]}
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Project Selection - Only show if not converting to project */}
          {selectedType !== "project" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Projeto (Macro)</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => {
                    setIsCreatingProject(!isCreatingProject);
                    setSelectedProjectId("");
                  }}
                >
                  <Plus className="h-3 w-3" />
                  {isCreatingProject ? "Selecionar existente" : "Criar novo"}
                </Button>
              </div>

              {isCreatingProject ? (
                <div className="space-y-3">
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Nome do novo projeto..."
                    className="h-10"
                  />
                  {/* Module for new project */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Módulo do Projeto <span className="text-destructive">*</span></Label>
                    <div className="grid grid-cols-4 gap-2">
                      {MODULE_OPTIONS.map(({ value, label }) => (
                        <Button
                          key={value}
                          type="button"
                          variant={newProjectModule === value ? "default" : "outline"}
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => setNewProjectModule(value)}
                        >
                          {MODULE_ICONS[value]}
                          <span className="text-xs">{label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Suggestions */}
                  {suggestedProjects.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Lightbulb className="h-3 w-3" />
                        Sugestões ({itemModule})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {suggestedProjects.map(p => (
                          <Badge
                            key={p.id}
                            variant={selectedProjectId === p.id ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => setSelectedProjectId(p.id)}
                          >
                            {p.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Select
                    value={selectedProjectId}
                    onValueChange={setSelectedProjectId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um projeto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedProjects.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Nenhum projeto encontrado.
                          <br />
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-1"
                            onClick={() => {
                              setIsCreatingProject(true);
                              setNewProjectName("Projeto Geral");
                            }}
                          >
                            Criar "Projeto Geral"
                          </Button>
                        </div>
                      ) : (
                        sortedProjects.map(project => {
                          const moduleConfig = getModuleConfig(project.module);
                          return (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center gap-2">
                                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                <span>{project.title}</span>
                                {project.module && (
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ml-1 ${moduleConfig.color} ${moduleConfig.bgColor} ${moduleConfig.borderColor}`}
                                  >
                                    {moduleConfig.label}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>

                  {/* Module override when project is selected */}
                  {selectedProjectId && (
                    <div className="space-y-2 pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">
                          Módulo do Item
                        </Label>
                        {selectedProject?.module && selectedModule !== selectedProject.module && (
                          <span className="text-xs text-amber-500">⚠️ Diferente do projeto</span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {MODULE_OPTIONS.map(({ value, label }) => (
                          <Button
                            key={value}
                            type="button"
                            variant={selectedModule === value ? "default" : "outline"}
                            size="sm"
                            className="flex items-center gap-1 h-8"
                            onClick={() => setSelectedModule(value)}
                          >
                            {MODULE_ICONS[value]}
                            <span className="text-xs">{label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Warning if no project selected */}
              {!canConfirm && (
                <p className="text-xs text-amber-500 flex items-center gap-1">
                  ⚠️ Selecione ou crie um projeto para continuar
                </p>
              )}
            </div>
          )}

          {/* When converting to project, show message */}
          {selectedType === "project" && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">
                Este item será convertido em um <strong>Projeto</strong> independente do módulo <strong>{MODULE_OPTIONS.find(m => m.value === newProjectModule)?.label}</strong>.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedType !== "project" && !canConfirm || isSubmitting}
          >
            {isSubmitting ? "Processando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
