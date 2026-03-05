// List Engine - Lists Page
// Grid view of all lists (type === 'list')

import { useState } from "react";
import { Plus, ListChecks, MoreHorizontal, Copy, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ListDetailModal, getListColor } from "@/components/lists/ListDetailModal";
import { useAtomItems } from "@/hooks/useAtomItems";
import { toast } from "sonner";
import { quickAddListSchema, getFirstError } from "@/lib/validation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AtomItem } from "@/types/atom-engine";

export default function Lists() {
  const { items, isLoading, createItem, deleteItem, updateItem } = useAtomItems();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [selectedList, setSelectedList] = useState<AtomItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Get all lists
  const lists = items.filter(item => item.type === "list");
  
  // Get children count for each list
  const getListChildren = (listId: string) => 
    items.filter(item => item.parent_id === listId);

  const getListProgress = (listId: string) => {
    const children = getListChildren(listId);
    if (children.length === 0) return { completed: 0, total: 0, percent: 0 };
    const completed = children.filter(c => c.completed).length;
    return {
      completed,
      total: children.length,
      percent: Math.round((completed / children.length) * 100)
    };
  };

  const handleCreateList = async () => {
    const validation = quickAddListSchema.safeParse({ title: newListTitle });
    if (!validation.success) {
      toast.error(getFirstError(validation.error));
      return;
    }
    
    setIsCreating(true);
    try {
      await createItem({
        title: newListTitle.trim(),
        type: "list",
        module: null,
        tags: [],
        parent_id: null,
        project_id: null,
        due_date: null,
        recurrence_rule: null,
        ritual_slot: null,
        completed: false,
        completed_at: null,
        notes: null,
        checklist: [],
        project_status: null,
        progress_mode: null,
        progress: null,
        deadline: null,
        weight: 1,
        order_index: 0,
      });
      toast.success("Lista criada!");
      setNewListTitle("");
      setCreateModalOpen(false);
    } catch (error) {
      toast.error("Erro ao criar lista");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicateList = async (list: AtomItem) => {
    try {
      // Create new list
      const newList = await createItem({
        title: `${list.title} (cópia)`,
        type: "list",
        module: list.module,
        tags: [...list.tags],
        parent_id: null,
        project_id: null,
        due_date: null,
        recurrence_rule: null,
        ritual_slot: null,
        completed: false,
        completed_at: null,
        notes: list.notes,
        checklist: [],
        project_status: null,
        progress_mode: null,
        progress: null,
        deadline: null,
        weight: 1,
        order_index: 0,
      });

      // Copy all children
      const children = getListChildren(list.id);
      for (const child of children) {
        await createItem({
          title: child.title,
          type: "task",
          module: child.module,
          tags: [...child.tags],
          parent_id: newList.id,
          project_id: null,
          due_date: child.due_date,
          recurrence_rule: null,
          ritual_slot: null,
          completed: false,
          completed_at: null,
          notes: child.notes,
          checklist: [],
          project_status: null,
          progress_mode: null,
          progress: null,
          deadline: null,
          weight: 1,
          order_index: child.order_index,
        });
      }

      toast.success("Lista duplicada!");
    } catch (error) {
      toast.error("Erro ao duplicar lista");
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      // Delete all children first
      const children = getListChildren(listId);
      for (const child of children) {
        await deleteItem(child.id);
      }
      // Delete the list
      await deleteItem(listId);
      toast.success("Lista excluída");
    } catch (error) {
      toast.error("Erro ao excluir lista");
    }
  };

  const handleClearCompleted = async (listId: string) => {
    try {
      const children = getListChildren(listId);
      const completed = children.filter(c => c.completed);
      for (const item of completed) {
        await deleteItem(item.id);
      }
      toast.success(`${completed.length} itens removidos`);
    } catch (error) {
      toast.error("Erro ao limpar concluídos");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-28 rounded-md" />
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListChecks className="h-7 w-7 text-primary" />
            Listas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lists.length} {lists.length === 1 ? "lista" : "listas"}
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Lista
        </Button>
      </header>

      {/* Empty state */}
      {lists.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <ListChecks className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma lista ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie listas para organizar compras, filmes, ideias e mais.
            </p>
            <Button onClick={() => setCreateModalOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira lista
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Grid of lists */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => {
            const progress = getListProgress(list.id);
            const children = getListChildren(list.id);
            const previewItems = children.slice(0, 5);
            const listColor = getListColor(list.tags);

            return (
              <Card 
                key={list.id} 
                className={cn(
                  "cursor-pointer transition-all group hover:shadow-md",
                  listColor.bg,
                  listColor.border,
                  listColor.id !== "default" && "border"
                )}
                onClick={() => setSelectedList(list)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full shrink-0", listColor.accent)} />
                      <span className="truncate">{list.title}</span>
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border z-50">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateList(list);
                        }}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearCompleted(list.id);
                          }}
                          disabled={progress.completed === 0}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Limpar concluídos
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList(list.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir lista
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {progress.total > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={progress.percent} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-2">
                  {children.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Lista vazia</p>
                  ) : (
                    <ul className="space-y-1">
                      {previewItems.map((item) => (
                        <li 
                          key={item.id}
                          className={cn(
                            "text-sm truncate flex items-center gap-2",
                            item.completed && "line-through text-muted-foreground"
                          )}
                        >
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            item.completed ? "bg-primary" : "bg-muted-foreground/30"
                          )} />
                          {item.title}
                        </li>
                      ))}
                      {children.length > 5 && (
                        <li className="text-xs text-muted-foreground">
                          +{children.length - 5} mais...
                        </li>
                      )}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create List Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Nova Lista
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Nome da lista..."
              onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateList} disabled={!newListTitle.trim() || isCreating}>
              {isCreating ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List Detail Modal */}
      {selectedList && (
        <ListDetailModal
          list={selectedList}
          open={!!selectedList}
          onOpenChange={(open) => !open && setSelectedList(null)}
          onClearCompleted={() => handleClearCompleted(selectedList.id)}
          onDuplicate={() => handleDuplicateList(selectedList)}
          onDelete={() => {
            handleDeleteList(selectedList.id);
            setSelectedList(null);
          }}
        />
      )}
    </div>
  );
}
