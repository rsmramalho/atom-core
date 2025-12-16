import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { CloudOff, Wifi, RefreshCw, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getQueueCount } from '@/lib/offline-queue';

export function NetworkStatusIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Poll for pending count
  useEffect(() => {
    const updateCount = async () => {
      const count = await getQueueCount();
      setPendingCount(count);
    };

    updateCount();
    const interval = setInterval(updateCount, 2000);
    return () => clearInterval(interval);
  }, []);

  // Show syncing indicator briefly when coming online with pending items
  useEffect(() => {
    if (isOnline && wasOffline && pendingCount > 0) {
      setIsSyncing(true);
      const timeout = setTimeout(() => setIsSyncing(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isOnline, wasOffline, pendingCount]);

  return (
    <AnimatePresence mode="wait">
      {/* Offline indicator */}
      {!isOnline && (
        <motion.div
          key="offline"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/90 text-destructive-foreground text-sm shadow-lg backdrop-blur-sm"
        >
          <CloudOff className="h-4 w-4" />
          <span>Sem conexão</span>
          {pendingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </motion.div>
      )}
      
      {/* Syncing indicator */}
      {isOnline && isSyncing && pendingCount > 0 && (
        <motion.div
          key="syncing"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm shadow-lg backdrop-blur-sm"
        >
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Sincronizando...</span>
        </motion.div>
      )}

      {/* Connection restored */}
      {isOnline && wasOffline && !isSyncing && (
        <motion.div
          key="restored"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/90 text-white text-sm shadow-lg backdrop-blur-sm"
        >
          <Wifi className="h-4 w-4" />
          <span>Conexão restaurada</span>
        </motion.div>
      )}

      {/* Pending items indicator (subtle, bottom corner) */}
      {isOnline && pendingCount > 0 && !isSyncing && !wasOffline && (
        <motion.div
          key="pending"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-20 right-4 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-sm shadow-lg"
        >
          <Cloud className="h-4 w-4" />
          <span>{pendingCount} não sincronizado{pendingCount > 1 ? 's' : ''}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
