import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { CloudOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NetworkStatusIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/90 text-destructive-foreground text-sm shadow-lg backdrop-blur-sm"
        >
          <CloudOff className="h-4 w-4" />
          <span>Sem conexão</span>
        </motion.div>
      )}
      
      {isOnline && wasOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/90 text-white text-sm shadow-lg backdrop-blur-sm"
        >
          <Wifi className="h-4 w-4" />
          <span>Conexão restaurada</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
