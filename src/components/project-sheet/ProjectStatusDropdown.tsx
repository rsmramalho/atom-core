// Project Status State Machine (A.9)
// Manages project lifecycle: Active → Paused → Completed → Archived

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Archive, 
  ChevronDown,
  Sparkles
} from "lucide-react";
import type { ProjectStatus } from "@/types/atom-engine";
import { cn } from "@/lib/utils";

interface ProjectStatusDropdownProps {
  status: ProjectStatus;
  onStatusChange: (newStatus: ProjectStatus) => void;
  disabled?: boolean;
}

const STATUS_CONFIG: Record<ProjectStatus, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = {
  draft: {
    label: "Rascunho",
    icon: <Pause className="h-3.5 w-3.5" />,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  active: {
    label: "Ativo",
    icon: <Play className="h-3.5 w-3.5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  paused: {
    label: "Pausado",
    icon: <Pause className="h-3.5 w-3.5" />,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  completed: {
    label: "Concluído",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  archived: {
    label: "Arquivado",
    icon: <Archive className="h-3.5 w-3.5" />,
    color: "text-slate-500 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800",
  },
};

// Valid transitions from each status
const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ["active", "archived"],
  active: ["paused", "completed", "archived"],
  paused: ["active", "archived"],
  completed: ["archived", "active"], // Can reopen
  archived: ["active"], // Can unarchive
};

export function ProjectStatusDropdown({
  status,
  onStatusChange,
  disabled = false,
}: ProjectStatusDropdownProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    targetStatus: ProjectStatus | null;
  }>({ open: false, targetStatus: null });

  const currentConfig = STATUS_CONFIG[status];
  const validTransitions = VALID_TRANSITIONS[status];

  const handleStatusSelect = (newStatus: ProjectStatus) => {
    // Completing a project requires confirmation
    if (newStatus === "completed") {
      setConfirmDialog({ open: true, targetStatus: "completed" });
      return;
    }
    
    // Archiving requires confirmation
    if (newStatus === "archived") {
      setConfirmDialog({ open: true, targetStatus: "archived" });
      return;
    }

    onStatusChange(newStatus);
  };

  const handleConfirm = () => {
    if (confirmDialog.targetStatus) {
      onStatusChange(confirmDialog.targetStatus);
    }
    setConfirmDialog({ open: false, targetStatus: null });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className={cn(
              "gap-1.5 h-8 px-3",
              currentConfig.color,
              currentConfig.bgColor,
              "border-transparent hover:border-border"
            )}
          >
            {currentConfig.icon}
            <span className="hidden sm:inline">{currentConfig.label}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {validTransitions.map((targetStatus) => {
            const config = STATUS_CONFIG[targetStatus];
            return (
              <DropdownMenuItem
                key={targetStatus}
                onClick={() => handleStatusSelect(targetStatus)}
                className={cn("gap-2", config.color)}
              >
                {config.icon}
                <span>
                  {targetStatus === "completed" ? "Marcar como Concluído" :
                   targetStatus === "archived" ? "Arquivar Projeto" :
                   targetStatus === "active" ? "Ativar" :
                   targetStatus === "paused" ? "Pausar" :
                   config.label}
                </span>
                {targetStatus === "completed" && (
                  <Sparkles className="h-3 w-3 ml-auto text-amber-500" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, targetStatus: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {confirmDialog.targetStatus === "completed" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  Concluir Projeto?
                </>
              ) : (
                <>
                  <Archive className="h-5 w-5 text-slate-500" />
                  Arquivar Projeto?
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.targetStatus === "completed" ? (
                <>
                  Ao marcar como concluído, você não poderá mais criar novas tasks neste projeto.
                  O projeto ficará disponível apenas para consulta.
                  <br /><br />
                  <strong className="text-foreground">Parabéns pela conquista! 🎉</strong>
                </>
              ) : (
                <>
                  Projetos arquivados são removidos das listagens principais mas podem ser
                  reativados a qualquer momento.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {confirmDialog.targetStatus === "completed" ? "Concluir" : "Arquivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
