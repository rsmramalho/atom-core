// Project Sheet - Quick Add Modal for Milestones
import { useState } from "react";
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
import { Diamond, Scale } from "lucide-react";

interface QuickAddMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, weight: number) => void;
  projectTitle: string;
}

export function QuickAddMilestoneModal({ 
  open, 
  onOpenChange, 
  onSubmit,
  projectTitle 
}: QuickAddMilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState(3);

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (weight < 1) return;
    onSubmit(title.trim(), weight);
    setTitle("");
    setWeight(3);
    onOpenChange(false);
  };

  const handleClose = () => {
    setTitle("");
    setWeight(3);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Diamond className="h-5 w-5 text-primary" />
            Nova Milestone
          </DialogTitle>
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-muted-foreground" />
                Peso da Milestone
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
              Peso define a importância. {weight === 1 && "Igual a uma task normal."}
              {weight === 3 && "Padrão: avança o progresso 3x mais rápido."}
              {weight > 3 && weight < 7 && "Milestone importante!"}
              {weight >= 7 && "Marco crucial do projeto!"}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || weight < 1}>
              Criar Milestone
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
