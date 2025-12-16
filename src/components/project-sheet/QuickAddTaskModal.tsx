// Project Sheet - Quick Add Modal for Tasks with Module Inheritance + Tag Glossary
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { ListTodo, Briefcase, Heart, Brain, Users, LayoutGrid, CalendarIcon, Repeat } from "lucide-react";
import { TagGlossary } from "@/components/shared/TagGlossary";
import { RecurrencePickerModal } from "@/components/shared/RecurrencePickerModal";
import { describeRRule } from "@/lib/recurrence-engine";
import { cn } from "@/lib/utils";

const MODULES = [
  { value: "work", label: "Work", icon: Briefcase, color: "text-blue-500" },
  { value: "body", label: "Body", icon: Heart, color: "text-red-500" },
  { value: "mind", label: "Mind", icon: Brain, color: "text-purple-500" },
  { value: "family", label: "Family", icon: Users, color: "text-green-500" },
  { value: "geral", label: "Geral", icon: LayoutGrid, color: "text-muted-foreground" },
];

interface QuickAddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, module: string | null, dueDate?: string | null, recurrenceRule?: string | null) => void;
  projectTitle: string;
  defaultModule?: string | null;
}

export function QuickAddTaskModal({ 
  open, 
  onOpenChange, 
  onSubmit,
  projectTitle,
  defaultModule,
}: QuickAddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [module, setModule] = useState<string>(defaultModule || "geral");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [recurrenceRule, setRecurrenceRule] = useState<string | null>(null);
  const [showRecurrencePicker, setShowRecurrencePicker] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setModule(defaultModule || "geral");
      setDueDate(undefined);
      setRecurrenceRule(null);
    }
  }, [open, defaultModule]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(
      title.trim(), 
      module === "geral" ? null : module,
      dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      recurrenceRule
    );
    setTitle("");
    setDueDate(undefined);
    setRecurrenceRule(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setTitle("");
    setModule(defaultModule || "geral");
    setDueDate(undefined);
    setRecurrenceRule(null);
    onOpenChange(false);
  };

  const selectedModule = MODULES.find(m => m.value === module);
  const ModuleIcon = selectedModule?.icon || LayoutGrid;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-blue-500" />
              Nova Task
            </DialogTitle>
            <TagGlossary />
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Adicionando ao projeto: <strong>{projectTitle}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="task-title">Título</Label>
            <Input
              id="task-title"
              placeholder="O que precisa ser feito?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Módulo</Label>
            <Select value={module} onValueChange={setModule}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <ModuleIcon className={`h-4 w-4 ${selectedModule?.color}`} />
                    {selectedModule?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-md z-50">
                {MODULES.map((mod) => (
                  <SelectItem key={mod.value} value={mod.value}>
                    <div className="flex items-center gap-2">
                      <mod.icon className={`h-4 w-4 ${mod.color}`} />
                      {mod.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {defaultModule && module !== defaultModule && (
              <p className="text-xs text-amber-600">
                Herdado do projeto: {defaultModule}
              </p>
            )}
          </div>

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
          </div>

          {/* Recurrence (only when due_date is set) */}
          {dueDate && (
            <div className="space-y-2">
              <Label>Recorrência</Label>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  recurrenceRule && "text-primary border-primary"
                )}
                onClick={() => setShowRecurrencePicker(true)}
              >
                <Repeat className="mr-2 h-4 w-4" />
                {recurrenceRule ? describeRRule(recurrenceRule) : "Não se repete"}
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim()}>
              Criar Task
            </Button>
          </div>
        </div>

        {/* Recurrence Picker Modal */}
        <RecurrencePickerModal
          open={showRecurrencePicker}
          onOpenChange={setShowRecurrencePicker}
          currentRule={recurrenceRule}
          onSave={setRecurrenceRule}
        />
      </DialogContent>
    </Dialog>
  );
}
