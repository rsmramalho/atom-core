import React, { createContext, useContext, ReactNode } from 'react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface OfflineSyncContextType {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  queueOperation: (
    type: 'insert' | 'update' | 'delete',
    table: string,
    data: Record<string, unknown>
  ) => Promise<string | null>;
  syncPendingOperations: (isAutoSync?: boolean) => Promise<void>;
  updatePendingCount: () => Promise<void>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | null>(null);

export function OfflineSyncProvider({ children }: { children: ReactNode }) {
  const offlineSync = useOfflineSync();

  return (
    <OfflineSyncContext.Provider value={offlineSync}>
      {children}
    </OfflineSyncContext.Provider>
  );
}

export function useOfflineSyncContext() {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error('useOfflineSyncContext must be used within OfflineSyncProvider');
  }
  return context;
}
