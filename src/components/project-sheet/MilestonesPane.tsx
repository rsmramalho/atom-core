// Project Sheet - Journey Pane (Milestones Timeline)
import { useState } from "react";
import { 
  Flag, 
  Plus, 
  Check, 
  Trash2,
  Diamond,
  Calendar,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/hooks/useMilestones";

interface MilestonesPaneProps {
  milestones: Milestone[];
  onToggle: (milestone: Milestone) => void;
  onCreate: (title: string) => void;
  onDelete: (id: string) => void;
  isCreating: boolean;
}

export function MilestonesPane({ 
  milestones, 
  onToggle, 
  onCreate, 
  onDelete,
  isCreating 
}: MilestonesPaneProps) {
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onCreate(newTitle.trim());
    setNewTitle("");
    setIsAdding(false);
  };

  // Sort: pending first, then by created_at
  const sortedMilestones = [...milestones].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
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
          <div className="flex gap-2 p-3 mb-4 bg-primary/10 rounded-lg border border-primary/20">
            <Input
              placeholder="Ex: Lançamento Beta, MVP Pronto..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
              className="flex-1 bg-background"
            />
            <Button 
              size="sm" 
              onClick={handleAdd}
              disabled={!newTitle.trim() || isCreating}
            >
              Criar
            </Button>
          </div>
        )}

        {/* Timeline */}
        {sortedMilestones.length > 0 && (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />
            
            <div className="space-y-3">
              {sortedMilestones.map((milestone, index) => (
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
                    <p className={cn(
                      "font-semibold",
                      milestone.completed && "text-primary"
                    )}>
                      {milestone.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge 
                        variant={milestone.completed ? "default" : "secondary"} 
                        className="text-xs py-0"
                      >
                        Peso: {milestone.weight}x
                      </Badge>
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
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={() => onDelete(milestone.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
  );
}
