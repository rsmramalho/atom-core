import { useState, useEffect } from "react";
import { CloudOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOfflineSyncContext } from "./OfflineSyncContext";
import { getQueuedOperations } from "@/lib/offline-queue";

interface PendingIndicatorProps {
  onClick?: () => void;
}

const STALE_THRESHOLD_MS = 30000; // 30 seconds

export function PendingIndicator({ onClick }: PendingIndicatorProps) {
  const { isOnline, pendingCount, isSyncing } = useOfflineSyncContext();
  const [hasStaleOperations, setHasStaleOperations] = useState(false);

  // Check for stale operations periodically
  useEffect(() => {
    if (pendingCount === 0) {
      setHasStaleOperations(false);
      return;
    }

    const checkStale = async () => {
      const operations = await getQueuedOperations();
      const now = Date.now();
      const hasStale = operations.some(op => now - op.timestamp > STALE_THRESHOLD_MS);
      setHasStaleOperations(hasStale);
    };

    checkStale();
    const interval = setInterval(checkStale, 5000); // Check every 5s

    return () => clearInterval(interval);
  }, [pendingCount]);

  if (pendingCount === 0 && isOnline) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-4 md:bottom-4 z-50",
        "flex items-center gap-2 px-3 py-2 rounded-full shadow-lg",
        "transition-all duration-300 animate-in slide-in-from-bottom-4",
        "border backdrop-blur-sm",
        !isOnline
          ? "bg-destructive/90 text-destructive-foreground border-destructive"
          : isSyncing
          ? "bg-primary/90 text-primary-foreground border-primary"
          : "bg-amber-500/90 text-white border-amber-600",
        hasStaleOperations && !isSyncing && "animate-pulse"
      )}
    >
      {isSyncing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CloudOff className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">
        {!isOnline ? (
          pendingCount > 0 ? `Offline • ${pendingCount} pendente${pendingCount > 1 ? 's' : ''}` : "Offline"
        ) : isSyncing ? (
          "Sincronizando..."
        ) : (
          `${pendingCount} pendente${pendingCount > 1 ? 's' : ''}`
        )}
      </span>
    </button>
  );
}
