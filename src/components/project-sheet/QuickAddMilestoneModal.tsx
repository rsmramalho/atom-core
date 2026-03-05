// Project Sheet - Quick Add Modal for Milestones with Module Inheritance + Tag Glossary
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { quickAddMilestoneSchema, getFirstError } from "@/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Diamond, Scale, HelpCircle, Briefcase, Heart, Brain, Users, LayoutGrid } from "lucide-react";
import { TagGlossary } from "@/components/shared/TagGlossary";

const MODULES = [
  { value: "work", label: "Work", icon: Briefcase, color: "text-blue-500" },
  { value: "body", label: "Body", icon: Heart, color: "text-red-500" },
  { value: "mind", label: "Mind", icon: Brain, color: "text-purple-500" },
  { value: "family", label: "Family", icon: Users, color: "text-green-500" },
  { value: "geral", label: "Geral", icon: LayoutGrid, color: "text-muted-foreground" },
];

interface QuickAddMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, weight: number, module: string | null) => void;
  projectTitle: string;
  defaultModule?: string | null;
}

export function QuickAddMilestoneModal({ 
  open, 
  onOpenChange, 
  onSubmit,
  projectTitle,
  defaultModule,
}: QuickAddMilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState(3);
  const [module, setModule] = useState<string>(defaultModule || "geral");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset values when modal opens
  useEffect(() => {
    if (open) {
      setModule(defaultModule || "geral");
    }
  }, [open, defaultModule]);

  const handleSubmit = async () => {
    const result = quickAddMilestoneSchema.safeParse({
      title,
      weight,
      module: module === "geral" ? null : module,
    });
    if (!result.success) {
      toast.error(getFirstError(result.error));
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), weight, module === "geral" ? null : module);
      setTitle("");
      setWeight(3);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setWeight(3);
    setModule(defaultModule || "geral");
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
              <Diamond className="h-5 w-5 text-primary" />
              Nova Milestone
            </DialogTitle>
            <TagGlossary />
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Adicionando ao projeto: <strong>{projectTitle}</strong>
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="milestone-title">Título</Label>
            <Input
              id="milestone-title"
              placeholder="Ex: Lançamento Beta, MVP Pronto..."
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                Peso da Milestone
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[280px]">
                    <p className="text-sm font-medium">
                      O peso define a importância no progresso.
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Fórmula: (Soma dos pesos concluídos ÷ Soma total dos pesos) × 100%
                    </p>
                    <p className="text-xs mt-1">
                      Ex: Milestone peso 3x concluída = +3 pontos. Task normal = +1 ponto.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <span className="text-lg font-bold text-primary">{weight}x</span>
            </div>
            <Slider
              value={[weight]}
              onValueChange={(v) => setWeight(v[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {weight === 1 && "Igual a uma task normal."}
              {weight === 2 && "Levemente mais importante."}
              {weight === 3 && "Padrão: avança o progresso 3x mais rápido."}
              {weight > 3 && weight < 7 && "Milestone importante!"}
              {weight >= 7 && "Marco crucial do projeto!"}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || weight < 1 || isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Milestone"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
