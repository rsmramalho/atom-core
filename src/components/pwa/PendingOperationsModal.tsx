import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getQueuedOperations, removeFromQueue, clearQueue, QueuedOperation } from "@/lib/offline-queue";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpCircle, ArrowDownCircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface PendingOperationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PendingOperationsModal({ open, onOpenChange }: PendingOperationsModalProps) {
  const [operations, setOperations] = useState<QueuedOperation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOperations = async () => {
    setLoading(true);
    try {
      const ops = await getQueuedOperations();
      setOperations(ops);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadOperations();
    }
  }, [open]);

  const handleCancelOperation = async (id: string) => {
    try {
      await removeFromQueue(id);
      setOperations(prev => prev.filter(op => op.id !== id));
      toast.success("Operação cancelada");
    } catch {
      toast.error("Erro ao cancelar operação");
    }
  };

  const handleCancelAll = async () => {
    try {
      await clearQueue();
      setOperations([]);
      toast.success("Todas as operações canceladas");
    } catch {
      toast.error("Erro ao cancelar operações");
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'insert':
        return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
      case 'update':
        return <ArrowDownCircle className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getOperationLabel = (type: string) => {
    switch (type) {
      case 'insert':
        return 'Criar';
      case 'update':
        return 'Atualizar';
      case 'delete':
        return 'Excluir';
      default:
        return type;
    }
  };

  const getItemTitle = (data: Record<string, unknown>) => {
    return (data.title as string) || (data.id as string)?.slice(0, 8) || 'Item';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Operações Pendentes ({operations.length})</DialogTitle>
          <DialogDescription>
            Estas operações serão sincronizadas quando você estiver online.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px]">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">
              Carregando...
            </div>
          ) : operations.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Nenhuma operação pendente
            </div>
          ) : (
            <div className="space-y-2">
              {operations.map((op) => (
                <div
                  key={op.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 group"
                >
                  {getOperationIcon(op.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {getItemTitle(op.data)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getOperationLabel(op.type)}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(op.timestamp, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                      {op.retryCount > 0 && (
                        <span className="ml-2 text-amber-500">
                          ({op.retryCount} tentativa{op.retryCount > 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => handleCancelOperation(op.id)}
                    title="Cancelar operação"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {operations.length > 0 && (
          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancelar Todas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar todas as operações?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá remover {operations.length} operação{operations.length > 1 ? 's' : ''} pendente{operations.length > 1 ? 's' : ''}. 
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelAll}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
