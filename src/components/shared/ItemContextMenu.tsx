// Atom Engine 4.0 - Item Context Menu
// Dropdown menu with Edit/Delete actions for items

import { MoreVertical, Pencil, Trash2, Archive, Sunrise, Sun, Sunset, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { RitualSlot } from "@/types/atom-engine";
import { toast } from "sonner";

interface ItemContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  onRitualSlotChange?: (slot: RitualSlot | null) => void;
  currentRitualSlot?: RitualSlot | null;
  isProject?: boolean;
  isHabit?: boolean;
  readOnly?: boolean;
}

export function ItemContextMenu({ 
  onEdit, 
  onDelete, 
  onArchive,
  onRitualSlotChange,
  currentRitualSlot,
  isProject = false,
  isHabit = false,
  readOnly = false
}: ItemContextMenuProps) {
  const handleReadOnlyAction = () => {
    toast.info("Somente leitura", {
      description: "Você é viewer neste projeto e não pode editar itens.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            readOnly ? handleReadOnlyAction() : onEdit();
          }}
          className={cn("cursor-pointer", readOnly && "opacity-50")}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        
        {/* Ritual slot submenu for habits */}
        {isHabit && onRitualSlotChange && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Clock className="h-4 w-4 mr-2" />
              Período do Ritual
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-popover border-border">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRitualSlotChange("manha");
                  }}
                  className={`cursor-pointer ${currentRitualSlot === "manha" ? "bg-amber-500/20 text-amber-600" : ""}`}
                >
                  <Sunrise className="h-4 w-4 mr-2" />
                  Manhã
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRitualSlotChange("meio_dia");
                  }}
                  className={`cursor-pointer ${currentRitualSlot === "meio_dia" ? "bg-yellow-500/20 text-yellow-600" : ""}`}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Meio-dia
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRitualSlotChange("noite");
                  }}
                  className={`cursor-pointer ${currentRitualSlot === "noite" ? "bg-purple-500/20 text-purple-600" : ""}`}
                >
                  <Sunset className="h-4 w-4 mr-2" />
                  Noite
                </DropdownMenuItem>
                {currentRitualSlot && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRitualSlotChange(null);
                      }}
                      className="cursor-pointer text-muted-foreground"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remover período
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}
        
        {isProject && onArchive && (
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              onArchive();
            }}
            className="cursor-pointer"
          >
            <Archive className="h-4 w-4 mr-2" />
            Arquivar
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            readOnly ? handleReadOnlyAction() : onDelete();
          }}
          className={cn("cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10", readOnly && "opacity-50")}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
