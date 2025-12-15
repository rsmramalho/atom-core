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
import { Diamond } from "lucide-react";

interface QuickAddMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string) => void;
  projectTitle: string;
}

export function QuickAddMilestoneModal({ 
  open, 
  onOpenChange, 
  onSubmit,
  projectTitle 
}: QuickAddMilestoneModalProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim());
    setTitle("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <div className="p-3 bg-primary/10 rounded-lg text-sm">
            <strong>Dica:</strong> Milestones são "Capítulos" grandes do projeto. 
            Peso 3x = avançam o progresso mais rápido que tasks.
          </div>
          <Input
            placeholder="Ex: Lançamento Beta, MVP Pronto..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim()}>
              Criar Milestone
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
