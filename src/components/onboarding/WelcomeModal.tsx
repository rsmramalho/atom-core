import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './OnboardingContext';
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

export function WelcomeModal() {
  const { showWelcome, setShowWelcome, completeWelcome, startTour } = useOnboarding();
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLastSlide = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (isLastSlide) return;
    setCurrentSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentSlide === 0) return;
    setCurrentSlide(prev => prev - 1);
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
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide 
                  ? 'bg-foreground w-6' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="pt-12 pb-6 px-6">
          <div className={`w-20 h-20 mx-auto rounded-2xl ${slide.bgColor} flex items-center justify-center mb-6`}>
            <Icon className={`w-10 h-10 ${slide.color}`} />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-3">{slide.title}</h2>
          <p className="text-muted-foreground text-center leading-relaxed">
            {slide.description}
          </p>
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

          {isLastSlide ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSkip}>
                Pular
              </Button>
              <Button size="sm" onClick={handleStartTour} className="gap-1">
                <Rocket className="w-4 h-4" />
                Iniciar Tour
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={handleNext} className="gap-1">
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
