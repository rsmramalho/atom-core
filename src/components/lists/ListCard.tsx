// List Engine - List Card Component
// Displays a list with interactive checkboxes

import { useState } from "react";
import { 
  CheckSquare, 
  Square, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Plus,
  ListChecks,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { AtomItem, ChecklistItem } from "@/types/atom-engine";

interface ListCardProps {
  list: AtomItem;
  onUpdate: (id: string, checklist: ChecklistItem[]) => void;
  onEdit: (list: AtomItem) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export function ListCard({ list, onUpdate, onEdit, onDelete, compact = false }: ListCardProps) {
  const [newItemText, setNewItemText] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const checklist = list.checklist || [];
  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggleItem = (itemId: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdate(list.id, updatedChecklist);
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      label: newItemText.trim(),
      completed: false,
    };
    
    onUpdate(list.id, [...checklist, newItem]);
    setNewItemText("");
    setIsAddingItem(false);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== itemId);
    onUpdate(list.id, updatedChecklist);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    } else if (e.key === "Escape") {
      setIsAddingItem(false);
      setNewItemText("");
    }
  };

  if (compact) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="rounded-lg border bg-card overflow-hidden">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-3 p-3 w-full hover:bg-accent/50 transition-colors group text-left">
              <ListChecks className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{list.title}</p>
                <p className="text-xs text-muted-foreground">
                  {completedCount}/{totalCount} itens
                </p>
              </div>
              <Progress value={progress} className="w-16 h-1.5" />
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" aria-label="Opções da lista">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border z-50">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(list); }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(list.id); }} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-3 pb-3 border-t">
              {/* Checklist items */}
              <div className="space-y-1 pt-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 p-1.5 rounded-md group hover:bg-muted/50 transition-colors",
                      item.completed && "opacity-60"
                    )}
                  >
                    <button
                      onClick={() => handleToggleItem(item.id)}
                      className="shrink-0 transition-transform hover:scale-110"
                    >
                      {item.completed ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new item */}
              {isAddingItem ? (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Novo item..."
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleAddItem} className="h-8 px-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingItem(true)}
                  className="w-full mt-2 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar item
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            {list.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border z-50">
              <DropdownMenuItem onClick={() => onEdit(list)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar título
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(list.id)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir lista
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Progress value={progress} className="h-1.5 flex-1" />
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {/* Checklist items */}
        <div className="space-y-1">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 p-1.5 rounded-md group hover:bg-muted/50 transition-colors",
                item.completed && "opacity-60"
              )}
            >
              <button
                onClick={() => handleToggleItem(item.id)}
                className="shrink-0 transition-transform hover:scale-110"
              >
                {item.completed ? (
                  <CheckSquare className="h-4 w-4 text-primary" />
                ) : (
                  <Square className="h-4 w-4 text-muted-foreground hover:text-primary" />
                )}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm",
                  item.completed && "line-through text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new item */}
        {isAddingItem ? (
          <div className="flex items-center gap-2 mt-2">
            <Input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Novo item..."
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleAddItem} className="h-8 px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingItem(true)}
            className="w-full mt-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
