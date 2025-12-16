import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from './OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  ListTodo, 
  Sun, 
  BookOpen, 
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Confetti } from '@/components/shared/Confetti';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'create_project',
    title: 'Crie seu primeiro projeto',
    description: 'Organize suas metas em projetos',
    icon: <FolderKanban className="h-5 w-5" />,
    route: '/projects',
  },
  {
    id: 'add_task',
    title: 'Adicione uma tarefa',
    description: 'Capture algo que precisa fazer',
    icon: <ListTodo className="h-5 w-5" />,
    route: '/inbox',
  },
  {
    id: 'complete_ritual',
    title: 'Complete um ritual',
    description: 'Experimente o Ritual View',
    icon: <Sun className="h-5 w-5" />,
    route: '/ritual',
  },
  {
    id: 'write_reflection',
    title: 'Escreva uma reflexão',
    description: 'Registre um pensamento no Journal',
    icon: <BookOpen className="h-5 w-5" />,
    route: '/journal',
  },
];

export function FirstStepsChecklist() {
  const { 
    showChecklist, 
    checklistProgress, 
    markChecklistItem, 
    dismissChecklist 
  } = useOnboarding();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  if (!showChecklist) return null;

  const completedCount = Object.values(checklistProgress).filter(Boolean).length;
  const progressPercent = (completedCount / checklistItems.length) * 100;
  const allCompleted = completedCount === checklistItems.length;

  // Trigger confetti when all items are completed (only once)
  useEffect(() => {
    if (allCompleted && !hasTriggeredConfetti) {
      setShowConfetti(true);
      setHasTriggeredConfetti(true);
    }
  }, [allCompleted, hasTriggeredConfetti]);

  const handleItemClick = (item: ChecklistItem) => {
    navigate(item.route);
    markChecklistItem(item.id);
  };

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary/10 p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Primeiros Passos</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={dismissChecklist}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={progressPercent} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground">
              {completedCount}/{checklistItems.length}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="p-2 max-h-64 overflow-y-auto">
          {checklistItems.map((item, index) => {
            const isCompleted = checklistProgress[item.id];
            
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isCompleted 
                    ? 'bg-primary/5 opacity-60' 
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <Check className="h-4 w-4" /> : item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-primary/10 border-t border-border text-center"
          >
            <p className="text-sm text-foreground font-medium mb-2">
              🎉 Parabéns! Você completou todos os passos!
            </p>
            <Button size="sm" onClick={dismissChecklist}>
              Fechar
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
    </>
  );
}
