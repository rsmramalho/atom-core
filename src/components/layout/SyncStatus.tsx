import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SyncStatusProps {
  lastSync: string;
  pendingCount: number;
  isOnline: boolean;
  isSyncing: boolean;
  onSync: () => void;
  onShowPending: () => void;
}

export function SyncStatus({ lastSync, pendingCount, isOnline, isSyncing, onSync, onShowPending }: SyncStatusProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2" aria-live="polite">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <RefreshCw className="h-3 w-3" />
        <span>Sync: {lastSync}</span>
        {pendingCount > 0 && (
          <button
            onClick={onShowPending}
            className="text-amber-500 hover:text-amber-400 hover:underline"
          >
            ({pendingCount})
          </button>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={onSync}
        disabled={!isOnline || isSyncing}
        title={!isOnline ? 'Offline' : 'Sincronizar agora'}
      >
        {isSyncing ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <RefreshCw className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
