import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getQueuedOperations, QueuedOperation } from "@/lib/offline-queue";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react";

interface PendingOperationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PendingOperationsModal({ open, onOpenChange }: PendingOperationsModalProps) {
  const [operations, setOperations] = useState<QueuedOperation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getQueuedOperations()
        .then(setOperations)
        .finally(() => setLoading(false));
    }
  }, [open]);

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
          <DialogTitle>Operações Pendentes</DialogTitle>
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
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
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
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
