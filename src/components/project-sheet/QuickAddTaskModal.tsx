// Project Sheet - Quick Add Modal for Tasks with Module Inheritance
import { useState, useEffect } from "react";
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
import { ListTodo, Briefcase, Heart, Brain, Users, LayoutGrid } from "lucide-react";

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
  onSubmit: (title: string, module: string | null) => void;
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

  // Reset module when modal opens with new default
  useEffect(() => {
    if (open) {
      setModule(defaultModule || "geral");
    }
  }, [open, defaultModule]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim(), module === "geral" ? null : module);
    setTitle("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setTitle("");
    setModule(defaultModule || "geral");
    onOpenChange(false);
  };

  const selectedModule = MODULES.find(m => m.value === module);
  const ModuleIcon = selectedModule?.icon || LayoutGrid;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-blue-500" />
            Nova Task
          </DialogTitle>
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

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim()}>
              Criar Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
