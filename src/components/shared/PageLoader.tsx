import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Carregando...' }: PageLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-8 h-8 text-primary" />
      </motion.div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}
