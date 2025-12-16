import { useState, useEffect, useCallback, useRef } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { supabase } from '@/integrations/supabase/client';
import {
  addToQueue,
  getQueuedOperations,
  removeFromQueue,
  updateRetryCount,
  getQueueCount,
  QueuedOperation,
} from '@/lib/offline-queue';
import { toast } from 'sonner';

const MAX_RETRIES = 3;

export function useOfflineSync() {
  const { isOnline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncInProgress = useRef(false);

  // Update pending count
  const updatePendingCount = useCallback(async () => {
    const count = await getQueueCount();
    setPendingCount(count);
  }, []);

  // Process a single operation
  const processOperation = useCallback(async (operation: QueuedOperation): Promise<boolean> => {
    try {
      const { type, table, data } = operation;

      switch (type) {
        case 'insert': {
          const { error } = await supabase.from(table as 'items').insert(data as never);
          if (error) throw error;
          break;
        }
        case 'update': {
          const { id, ...updateData } = data;
          const { error } = await supabase
            .from(table as 'items')
            .update(updateData as never)
            .eq('id', id as string);
          if (error) throw error;
          break;
        }
        case 'delete': {
          const { error } = await supabase
            .from(table as 'items')
            .delete()
            .eq('id', data.id as string);
          if (error) throw error;
          break;
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to process operation:', error);
      return false;
    }
  }, []);

  // Sync all pending operations
  const syncPendingOperations = useCallback(async (isAutoSync = false) => {
    if (syncInProgress.current || !isOnline) return;

    syncInProgress.current = true;
    setIsSyncing(true);

    try {
      const operations = await getQueuedOperations();
      
      if (operations.length === 0) {
        syncInProgress.current = false;
        setIsSyncing(false);
        return;
      }

      if (isAutoSync) {
        toast.info('Conexão restaurada - sincronizando...', { duration: 2000 });
      }

      let successCount = 0;
      let failCount = 0;

      for (const operation of operations) {
        if (operation.retryCount >= MAX_RETRIES) {
          // Too many retries, remove from queue
          await removeFromQueue(operation.id);
          failCount++;
          continue;
        }

        const success = await processOperation(operation);

        if (success) {
          await removeFromQueue(operation.id);
          successCount++;
        } else {
          await updateRetryCount(operation.id);
          failCount++;
        }
      }

      await updatePendingCount();

      if (successCount > 0) {
        toast.success(`${successCount} alteração(ões) sincronizada(s)`);
      }

      if (failCount > 0) {
        toast.error(`${failCount} operação(ões) falhou(aram)`);
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      syncInProgress.current = false;
      setIsSyncing(false);
    }
  }, [isOnline, processOperation, updatePendingCount]);

  // Queue an operation
  const queueOperation = useCallback(async (
    type: 'insert' | 'update' | 'delete',
    table: string,
    data: Record<string, unknown>
  ): Promise<string | null> => {
    try {
      const id = await addToQueue({ type, table, data });
      await updatePendingCount();
      toast.info('Salvo offline - será sincronizado quando online');
      return id;
    } catch (error) {
      console.error('Failed to queue operation:', error);
      toast.error('Erro ao salvar offline');
      return null;
    }
  }, [updatePendingCount]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      syncPendingOperations(true); // true = auto sync
    }
  }, [isOnline, syncPendingOperations]);

  // Initial pending count
  useEffect(() => {
    updatePendingCount();
  }, [updatePendingCount]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    queueOperation,
    syncPendingOperations,
  };
}
