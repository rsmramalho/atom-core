// Project Sheet - Milestones Pane (A.13)
import { useState } from "react";
import { 
  Flag, 
  Plus, 
  Check, 
  Trash2,
  Diamond,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const pendingMilestones = milestones.filter(m => !m.completed);
  const completedMilestones = milestones.filter(m => m.completed);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Diamond className="h-5 w-5 text-primary" />
            Milestones
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add new milestone */}
        {isAdding && (
          <div className="flex gap-2 p-3 bg-muted/50 rounded-lg">
            <Input
              placeholder="Nome da milestone..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
              className="flex-1"
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

        {/* Pending milestones */}
        {pendingMilestones.length > 0 && (
          <div className="space-y-2">
            {pendingMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors group"
              >
                <button
                  onClick={() => onToggle(milestone)}
                  className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                >
                  <Flag className="h-3 w-3 text-primary/50" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{milestone.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs py-0">
                      Peso: {milestone.weight}x
                    </Badge>
                    {milestone.due_date && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(milestone.due_date).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
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
        )}

        {/* Completed milestones */}
        {completedMilestones.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-medium">
              Completos ({completedMilestones.length})
            </p>
            {completedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 group"
              >
                <button
                  onClick={() => onToggle(milestone)}
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                >
                  <Check className="h-3 w-3" />
                </button>
                <span className="flex-1 line-through text-muted-foreground truncate">
                  {milestone.title}
                </span>
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
        )}

        {/* Empty state */}
        {milestones.length === 0 && !isAdding && (
          <div className="text-center py-6 text-muted-foreground">
            <Diamond className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma milestone ainda</p>
            <p className="text-xs">Milestones têm peso maior no progresso</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
