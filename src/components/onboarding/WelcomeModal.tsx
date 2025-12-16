import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './OnboardingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Inbox, 
  FolderKanban, 
  Sun, 
  Calendar, 
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Rocket
} from 'lucide-react';

const slides = [
  {
    icon: Sparkles,
    title: 'Bem-vindo ao MindMate',
    description: 'Seu sistema pessoal de produtividade e reflexão. Organize tarefas, cultive hábitos e registre pensamentos em um só lugar.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Inbox,
    title: 'Capture Tudo',
    description: 'Use o Inbox para capturar qualquer pensamento rapidamente. Depois, organize com projetos e tags.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: FolderKanban,
    title: 'Projetos Inteligentes',
    description: 'Agrupe tarefas em projetos, crie milestones e acompanhe o progresso automaticamente.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Sun,
    title: 'Rituais Diários',
    description: 'Configure hábitos para manhã, meio-dia ou noite. O Ritual View cria momentos focados para completá-los.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Calendar,
    title: 'Visão Temporal',
    description: 'Visualize suas tarefas no calendário. Arraste para reagendar e nunca perca prazos.',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: BookOpen,
    title: 'Journal Pessoal',
    description: 'Registre reflexões e pensamentos. Use prompts guiados para momentos de introspecção.',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
};

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  exit: { scale: 0, rotate: 180 },
};

export function WelcomeModal() {
  const { showWelcome, setShowWelcome, completeWelcome, startTour } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const isLastSlide = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLastSlide) return;
    setDirection(1);
    setCurrentSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentSlide === 0) return;
    setDirection(-1);
    setCurrentSlide(prev => prev - 1);
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  const handleStartTour = () => {
    completeWelcome();
    startTour();
  };

  const handleSkip = () => {
    completeWelcome();
  };

  return (
    <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none">
        {/* Progress dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-colors ${
                idx === currentSlide 
                  ? 'bg-foreground' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              animate={{ width: idx === currentSlide ? 24 : 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="pt-12 pb-6 px-6 min-h-[280px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
            >
              <motion.div 
                className={`w-20 h-20 mx-auto rounded-2xl ${slide.bgColor} flex items-center justify-center mb-6`}
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <Icon className={`w-10 h-10 ${slide.color}`} />
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold text-center mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {slide.title}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-center leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slide.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <AnimatePresence mode="wait">
            {isLastSlide ? (
              <motion.div 
                key="final"
                className="flex gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button variant="outline" size="sm" onClick={handleSkip}>
                  Pular
                </Button>
                <Button size="sm" onClick={handleStartTour} className="gap-1">
                  <Rocket className="w-4 h-4" />
                  Iniciar Tour
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="next"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button size="sm" onClick={handleNext} className="gap-1">
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
