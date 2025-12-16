// List Engine - Quick Add List Modal
// Modal for creating new list items

import { useState } from "react";
import { ListChecks, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ChecklistItem } from "@/types/atom-engine";

interface QuickAddListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, checklist: ChecklistItem[]) => void;
  projectId?: string;
  projectModule?: string;
  isLoading?: boolean;
}

export function QuickAddListModal({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}: QuickAddListModalProps) {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>([""]);

  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === items.length - 1) {
        handleAddItem();
      }
      // Focus next input
      setTimeout(() => {
        const inputs = document.querySelectorAll('[data-list-item-input]');
        const nextInput = inputs[index + 1] as HTMLInputElement;
        nextInput?.focus();
      }, 0);
    } else if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
      e.preventDefault();
      handleRemoveItem(index);
      // Focus previous input
      setTimeout(() => {
        const inputs = document.querySelectorAll('[data-list-item-input]');
        const prevInput = inputs[index - 1] as HTMLInputElement;
        prevInput?.focus();
      }, 0);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const checklist: ChecklistItem[] = items
      .filter(item => item.trim())
      .map(item => ({
        id: crypto.randomUUID(),
        label: item.trim(),
        completed: false,
      }));

    onSave(title.trim(), checklist);
    
    // Reset form
    setTitle("");
    setItems([""]);
  };

  const handleClose = () => {
    setTitle("");
    setItems([""]);
    onOpenChange(false);
  };

  const canSave = title.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Nova Lista
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="list-title">Título da lista</Label>
            <Input
              id="list-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Lista de compras"
              autoFocus
            />
          </div>

          {/* Items */}
          <div className="space-y-2">
            <Label>Itens (opcional)</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    data-list-item-input
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder={`Item ${index + 1}`}
                    className="h-9"
                  />
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar item
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!canSave || isLoading}>
            {isLoading ? "Criando..." : "Criar lista"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
