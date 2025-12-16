// Project Sheet - Journey Pane (Milestones Timeline)
import { useState } from "react";
import { 
  Plus, 
  Check, 
  Diamond,
  Calendar,
  Sparkles,
  Scale,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ItemContextMenu, DeleteConfirmDialog } from "@/components/shared";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { Milestone } from "@/hooks/useMilestones";

interface MilestonesPaneProps {
  milestones: Milestone[];
  onToggle: (milestone: Milestone) => void;
  onCreate: (title: string, weight: number) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Milestone>) => void;
  isCreating: boolean;
}

export function MilestonesPane({ 
  milestones, 
  onToggle, 
  onCreate, 
  onDelete,
  onUpdate,
  isCreating 
}: MilestonesPaneProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newWeight, setNewWeight] = useState(3);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(null);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    if (newWeight < 1) return;
    onCreate(newTitle.trim(), newWeight);
    setNewTitle("");
    setNewWeight(3);
    setIsAdding(false);
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setEditingTitle(milestone.title);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingTitle.trim()) return;
    if (onUpdate) {
      onUpdate(editingId, { title: editingTitle.trim() });
      toast({
        title: "Milestone atualizada",
        description: "O título foi alterado.",
      });
    }
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDeleteClick = (milestone: Milestone) => {
    setMilestoneToDelete(milestone);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (milestoneToDelete) {
      onDelete(milestoneToDelete.id);
      setDeleteDialogOpen(false);
      setMilestoneToDelete(null);
      toast({
        title: "Milestone excluída",
        description: "A milestone foi removida.",
      });
    }
  };

  // Sort: pending first, then by created_at
  const sortedMilestones = [...milestones].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Jornada
              <Badge variant="outline" className="ml-2 font-normal">
                {milestones.filter(m => m.completed).length}/{milestones.length}
              </Badge>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAdding(!isAdding)}
              className="border-primary/30 hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {/* Add new milestone */}
          {isAdding && (
            <div className="space-y-3 p-4 mb-4 bg-primary/10 rounded-lg border border-primary/20">
              <Input
                placeholder="Ex: Lançamento Beta, MVP Pronto..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                autoFocus
                className="bg-background"
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  <span>Peso:</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[260px]">
                      <p className="text-sm font-medium">Impacto no progresso</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        Peso concluídos ÷ Peso total × 100%
                      </p>
                      <p className="text-xs mt-1">
                        Peso 3x = avança 3x mais que uma task normal.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Slider
                  value={[newWeight]}
                  onValueChange={(v) => setNewWeight(v[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-primary w-10 text-right">{newWeight}x</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => { setIsAdding(false); setNewTitle(""); setNewWeight(3); }}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAdd}
                  disabled={!newTitle.trim() || newWeight < 1 || isCreating}
                >
                  Criar
                </Button>
              </div>
            </div>
          )}

          {/* Timeline */}
          {sortedMilestones.length > 0 && (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
              
              <div className="space-y-3">
                {sortedMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={cn(
                      "relative flex items-start gap-4 p-3 rounded-lg transition-all group",
                      milestone.completed 
                        ? "bg-primary/10 border border-primary/30" 
                        : "bg-card border border-border/50 hover:border-primary/50"
                    )}
                  >
                    {/* Timeline node */}
                    <button
                      onClick={() => onToggle(milestone)}
                      className={cn(
                        "relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        milestone.completed 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                          : "bg-background border-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                      )}
                    >
                      {milestone.completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Diamond className="h-5 w-5 text-primary/60" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      {editingId === milestone.id ? (
                        <div className="flex gap-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit();
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                            className="h-8"
                          />
                          <Button size="sm" onClick={handleSaveEdit}>
                            Salvar
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className={cn(
                            "font-semibold",
                            milestone.completed && "text-primary"
                          )}>
                            {milestone.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  variant={milestone.completed ? "default" : "secondary"} 
                                  className="text-xs py-0 cursor-help"
                                >
                                  Peso: {milestone.weight}x
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[220px]">
                                <p className="text-xs">
                                  Esta milestone vale <strong>{milestone.weight} pontos</strong> no cálculo de progresso.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                            {milestone.due_date && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(milestone.due_date).toLocaleDateString("pt-BR")}
                              </span>
                            )}
                            {milestone.completed && (
                              <span className="text-xs text-primary flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Concluída
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Context Menu */}
                    {editingId !== milestone.id && (
                      <ItemContextMenu
                        onEdit={() => handleEdit(milestone)}
                        onDelete={() => handleDeleteClick(milestone)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {milestones.length === 0 && !isAdding && (
            <div className="text-center py-8 text-muted-foreground">
              <Diamond className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhuma milestone ainda</p>
              <p className="text-sm mt-1">
                Milestones são "Capítulos" do projeto.<br />
                Peso 3x = avançam o progresso mais rápido.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={milestoneToDelete?.title || ""}
      />
    </>
  );
}
