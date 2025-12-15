// Atom Engine 4.0 - Delete Confirm Dialog
// Confirmation dialog for deleting items (with special project handling)

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (deleteChildren?: boolean) => Promise<void>;
  title: string;
  isProject?: boolean;
  childCount?: number;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  isProject = false,
  childCount = 0,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const [deleteOption, setDeleteOption] = useState<"archive" | "delete">("archive");

  const handleConfirm = async () => {
    if (isProject && childCount > 0) {
      await onConfirm(deleteOption === "delete");
    } else {
      await onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Tem certeza que deseja excluir{" "}
                <span className="font-semibold text-foreground">"{title}"</span>?
              </p>

              {isProject && childCount > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-foreground">
                    Este projeto contém{" "}
                    <span className="font-semibold">{childCount} itens</span>. O
                    que deseja fazer com eles?
                  </p>

                  <RadioGroup
                    value={deleteOption}
                    onValueChange={(v) =>
                      setDeleteOption(v as "archive" | "delete")
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="archive" id="archive" />
                      <Label htmlFor="archive" className="cursor-pointer">
                        Arquivar itens (mover para inbox)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delete" id="delete" />
                      <Label
                        htmlFor="delete"
                        className="cursor-pointer text-destructive"
                      >
                        Excluir tudo permanentemente
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
