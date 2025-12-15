// Atom Engine 4.0 - Item Context Menu
// Dropdown menu with Edit/Delete actions for items

import { MoreVertical, Pencil, Trash2, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ItemContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  isProject?: boolean;
}

export function ItemContextMenu({ 
  onEdit, 
  onDelete, 
  onArchive,
  isProject = false 
}: ItemContextMenuProps) {
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
            onEdit();
          }}
          className="cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </DropdownMenuItem>
        
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
            onDelete();
          }}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
