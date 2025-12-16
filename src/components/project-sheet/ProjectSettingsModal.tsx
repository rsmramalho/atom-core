// Project Settings Modal (A.18)
// Configure progress mode and other project settings

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings2, Calculator, Flag, Sliders } from "lucide-react";
import type { ProgressMode } from "@/types/atom-engine";
import { cn } from "@/lib/utils";

interface ProjectSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progressMode: ProgressMode;
  manualProgress: number;
  onSave: (progressMode: ProgressMode, manualProgress?: number) => void;
}

const PROGRESS_MODES: {
  value: ProgressMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "auto",
    label: "Automático (Tasks + Milestones)",
    description: "Calcula baseado no peso de tasks e milestones concluídas",
    icon: <Calculator className="h-4 w-4" />,
  },
  {
    value: "milestone",
    label: "Apenas Milestones",
    description: "Ignora tasks e considera apenas milestones para o progresso",
    icon: <Flag className="h-4 w-4" />,
  },
  {
    value: "manual",
    label: "Manual",
    description: "Você define manualmente o percentual de progresso",
    icon: <Sliders className="h-4 w-4" />,
  },
];

export function ProjectSettingsModal({
  open,
  onOpenChange,
  progressMode,
  manualProgress,
  onSave,
}: ProjectSettingsModalProps) {
  const [selectedMode, setSelectedMode] = useState<ProgressMode>(progressMode);
  const [manualValue, setManualValue] = useState(manualProgress);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedMode(progressMode);
      setManualValue(manualProgress);
    }
  }, [open, progressMode, manualProgress]);

  const handleSave = () => {
    onSave(selectedMode, selectedMode === "manual" ? manualValue : undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Configurações do Projeto
          </DialogTitle>
          <DialogDescription>
            Defina como o progresso do projeto é calculado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Mode Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Modo de Progresso</Label>
            <RadioGroup
              value={selectedMode}
              onValueChange={(v) => setSelectedMode(v as ProgressMode)}
              className="space-y-2"
            >
              {PROGRESS_MODES.map((mode) => (
                <div
                  key={mode.value}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedMode === mode.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedMode(mode.value)}
                >
                  <RadioGroupItem
                    value={mode.value}
                    id={mode.value}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{mode.icon}</span>
                      <Label
                        htmlFor={mode.value}
                        className="font-medium cursor-pointer"
                      >
                        {mode.label}
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {mode.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Manual Progress Slider */}
          {selectedMode === "manual" && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Progresso Manual</Label>
                <span className="text-2xl font-bold text-primary">
                  {manualValue}%
                </span>
              </div>
              <Slider
                value={[manualValue]}
                onValueChange={([value]) => setManualValue(value)}
                max={100}
                step={5}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">
                Arraste para definir o progresso atual do projeto
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
