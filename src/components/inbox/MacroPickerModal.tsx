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
  Sparkles
} from "lucide-react";
import type { AtomItem, ItemType } from "@/types/atom-engine";

interface MacroPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: AtomItem | null;
  projects: AtomItem[];
  onPromote: (itemId: string, projectId: string, projectName: string, type: ItemType) => void;
  onCreateProject: (name: string, module: string | null) => Promise<AtomItem | undefined>;
}

const TYPE_OPTIONS: { value: ItemType; label: string; icon: React.ReactNode }[] = [
  { value: "task", label: "Tarefa", icon: <CheckSquare className="h-4 w-4" /> },
  { value: "habit", label: "Hábito", icon: <RefreshCw className="h-4 w-4" /> },
  { value: "note", label: "Nota", icon: <FileText className="h-4 w-4" /> },
  { value: "project", label: "Projeto", icon: <FolderKanban className="h-4 w-4" /> },
];

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
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract module from item tags if present
  const itemModule = useMemo(() => {
    if (!item) return null;
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

  // Reset state when modal opens with new item
  useEffect(() => {
    if (open && item) {
      setSelectedType(item.type !== "project" ? item.type : "task");
      setSelectedProjectId("");
      setIsCreatingProject(false);
      setNewProjectName("");
    }
  }, [open, item?.id]);

  const handleConfirm = async () => {
    if (!item) return;
    
    setIsSubmitting(true);
    
    try {
      if (selectedType === "project") {
        // Converting item to a standalone project
        onPromote(item.id, "", item.title, "project");
        onOpenChange(false);
      } else if (isCreatingProject && newProjectName.trim()) {
        // Create new project first
        const newProject = await onCreateProject(newProjectName.trim(), itemModule);
        if (newProject) {
          onPromote(item.id, newProject.id, newProject.title, selectedType);
          onOpenChange(false);
        }
      } else if (selectedProjectId) {
        const project = projects.find(p => p.id === selectedProjectId);
        if (project) {
          onPromote(item.id, selectedProjectId, project.title, selectedType);
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
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Nome do novo projeto..."
                  className="h-10"
                />
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
                        sortedProjects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <FolderKanban className="h-4 w-4 text-muted-foreground" />
                              <span>{project.title}</span>
                              {project.module && (
                                <Badge variant="secondary" className="text-xs ml-1">
                                  {project.module}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
                Este item será convertido em um <strong>Projeto</strong> independente.
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
