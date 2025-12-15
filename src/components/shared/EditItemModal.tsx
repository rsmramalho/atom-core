// Atom Engine 4.0 - Edit Item Modal
// Modal for editing existing items with pre-loaded data

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Briefcase, Dumbbell, Brain, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { MODULE_OPTIONS } from "./ModuleBadge";
import type { AtomItem, ItemType, RitualSlot, ProjectStatus } from "@/types/atom-engine";

interface EditItemModalProps {
  item: AtomItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<AtomItem>) => Promise<void>;
  isLoading?: boolean;
}

const itemTypeLabels: Record<ItemType, string> = {
  task: "Tarefa",
  habit: "Hábito",
  note: "Nota",
  project: "Projeto",
  reflection: "Reflexão",
  resource: "Recurso",
  list: "Lista",
};

const ritualSlotLabels: Record<string, string> = {
  manha: "🌅 Manhã",
  meio_dia: "☀️ Meio-dia",
  noite: "🌙 Noite",
  none: "Nenhum",
};

const projectStatusLabels: Record<ProjectStatus, string> = {
  draft: "Rascunho",
  active: "Ativo",
  paused: "Pausado",
  completed: "Concluído",
  archived: "Arquivado",
};

const MODULE_ICONS: Record<string, React.ReactNode> = {
  work: <Briefcase className="h-4 w-4 text-blue-500" />,
  body: <Dumbbell className="h-4 w-4 text-orange-500" />,
  mind: <Brain className="h-4 w-4 text-purple-500" />,
  family: <Users className="h-4 w-4 text-rose-500" />,
};

export function EditItemModal({
  item,
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: EditItemModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ItemType>("task");
  const [notes, setNotes] = useState("");
  const [module, setModule] = useState("geral");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [ritualSlot, setRitualSlot] = useState<RitualSlot>(null);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("active");
  const [tags, setTags] = useState("");

  // Load item data when modal opens
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setType(item.type);
      setNotes(item.notes || "");
      setModule(item.module || "geral");
      setDueDate(item.due_date ? new Date(item.due_date) : undefined);
      setRitualSlot(item.ritual_slot);
      setProjectStatus(item.project_status || "active");
      setTags(item.tags.filter(t => !t.startsWith("#inbox")).join(", "));
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    // Ensure module is never null for projects
    const finalModule = type === "project" && !module ? "geral" : (module || "geral");

    await onSave({
      title,
      type,
      notes: notes || null,
      module: finalModule,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      ritual_slot: ritualSlot,
      project_status: type === "project" ? projectStatus : null,
      tags: parsedTags,
    });
  };

  if (!item) return null;

  const isProject = type === "project";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle>Editar {itemTypeLabels[item.type]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do item..."
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as ItemType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(itemTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Module - Required for projects, optional for others */}
          <div className="space-y-2">
            <Label>
              Módulo {isProject && <span className="text-destructive">*</span>}
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {MODULE_OPTIONS.map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  variant={module === value ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1 h-9"
                  onClick={() => setModule(value)}
                >
                  {MODULE_ICONS[value]}
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
            {isProject && !module && (
              <p className="text-xs text-destructive">
                Projetos precisam de um módulo definido
              </p>
            )}
          </div>

          {/* Project Status (only for projects) */}
          {type === "project" && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={projectStatus}
                onValueChange={(v) => setProjectStatus(v as ProjectStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(projectStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Ritual Slot (for habits) */}
          {type === "habit" && (
            <div className="space-y-2">
              <Label>Slot do Ritual</Label>
              <Select
                value={ritualSlot || "none"}
                onValueChange={(v) =>
                  setRitualSlot(v === "none" ? null : (v as RitualSlot))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ritualSlotLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDueDate(undefined)}
                className="text-xs text-muted-foreground"
              >
                Limpar data
              </Button>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#urgente, #focus..."
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anotações adicionais..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || (isProject && !module) || isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
