import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './OnboardingContext';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Check,
  Inbox,
  FolderKanban,
  Sun,
  Calendar,
  BookOpen
} from 'lucide-react';

const stepIcons = {
  inbox: Inbox,
  projects: FolderKanban,
  ritual: Sun,
  calendar: Calendar,
  journal: BookOpen,
};

export function TourOverlay() {
  const { 
    showTour, 
    currentTourStep, 
    tourSteps, 
    nextTourStep, 
    prevTourStep, 
    skipTour,
    completeTour 
  } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = tourSteps[currentTourStep];
  const isLastStep = currentTourStep === tourSteps.length - 1;
  const Icon = stepIcons[currentStep?.id as keyof typeof stepIcons] || Inbox;

  // Navigate to the step's route when step changes
  useEffect(() => {
    if (showTour && currentStep?.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [showTour, currentStep, navigate, location.pathname]);

  if (!showTour) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto" />
      
      {/* Tour card */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md pointer-events-auto">
        <div className="bg-card border rounded-xl shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentTourStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    {currentTourStep + 1} de {tourSteps.length}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{currentStep.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentStep.description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-5 pb-5 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Pular
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTourStep}
                disabled={currentTourStep === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {isLastStep ? (
                <Button size="sm" onClick={completeTour} className="gap-1">
                  <Check className="w-4 h-4" />
                  Concluir
                </Button>
              ) : (
                <Button size="sm" onClick={nextTourStep} className="gap-1">
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-auto">
        {tourSteps.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentTourStep 
                ? 'bg-primary' 
                : idx < currentTourStep 
                  ? 'bg-primary/50' 
                  : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
