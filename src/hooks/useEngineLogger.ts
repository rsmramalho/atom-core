// Atom Engine 4.0 - Engine Logger Hook
// Global logging system for debug console

import { create } from 'zustand';
import type { EngineLogEntry } from '@/types/atom-engine';

interface EngineLoggerState {
  logs: EngineLogEntry[];
  addLog: (engine: string, action: string, details?: Record<string, unknown>) => void;
  clearLogs: () => void;
}

export const useEngineLoggerStore = create<EngineLoggerState>((set) => ({
  logs: [],
  addLog: (engine, action, details) => {
    const entry: EngineLogEntry = {
      timestamp: new Date().toISOString(),
      engine,
      action,
      details,
    };
    set((state) => ({
      logs: [...state.logs, entry].slice(-500), // Keep last 500 logs
    }));
  },
  clearLogs: () => set({ logs: [] }),
}));

export function useEngineLogger() {
  const { logs, addLog, clearLogs } = useEngineLoggerStore();
  return { logs, addLog, clearLogs };
}
