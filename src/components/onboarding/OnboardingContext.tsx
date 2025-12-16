import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  route?: string;
}

interface ChecklistProgress {
  [key: string]: boolean;
}

interface OnboardingContextType {
  hasCompletedWelcome: boolean;
  hasCompletedTour: boolean;
  currentTourStep: number;
  tourSteps: OnboardingStep[];
  showWelcome: boolean;
  showTour: boolean;
  showChecklist: boolean;
  checklistProgress: ChecklistProgress;
  setShowWelcome: (show: boolean) => void;
  completeWelcome: () => void;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  resetOnboarding: () => void;
  markChecklistItem: (itemId: string) => void;
  dismissChecklist: () => void;
}

const tourSteps: OnboardingStep[] = [
  {
    id: 'inbox',
    title: 'Inbox - Capture Rápida',
    description: 'Capture qualquer pensamento aqui. Use tokens como @hoje, @amanha, #focus para organizar automaticamente.',
    route: '/inbox',
  },
  {
    id: 'projects',
    title: 'Projetos - Organize suas Metas',
    description: 'Crie projetos para agrupar tarefas relacionadas. Acompanhe o progresso com milestones e diferentes modos de cálculo.',
    route: '/projects',
  },
  {
    id: 'ritual',
    title: 'Ritual - Hábitos Diários',
    description: 'Configure hábitos para manhã, meio-dia ou noite. O Ritual View cria um momento focado para completá-los.',
    route: '/ritual',
  },
  {
    id: 'calendar',
    title: 'Calendário - Visão Temporal',
    description: 'Visualize suas tarefas no tempo. Arraste para reagendar e veja items atrasados destacados.',
    route: '/calendar',
  },
  {
    id: 'journal',
    title: 'Journal - Reflexão Pessoal',
    description: 'Registre pensamentos e reflexões. Use prompts guiados e tags como #mood para filtrar depois.',
    route: '/journal',
  },
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = 'mindmate_onboarding';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(true);
  const [hasCompletedTour, setHasCompletedTour] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistProgress, setChecklistProgress] = useState<ChecklistProgress>({});
  const [currentTourStep, setCurrentTourStep] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setHasCompletedWelcome(data.hasCompletedWelcome ?? false);
      setHasCompletedTour(data.hasCompletedTour ?? false);
      setShowChecklist(data.showChecklist ?? false);
      setChecklistProgress(data.checklistProgress ?? {});
    } else {
      // First time user
      setHasCompletedWelcome(false);
      setHasCompletedTour(false);
      setShowWelcome(true);
    }
  }, []);

  const saveState = (updates: Partial<{
    hasCompletedWelcome: boolean;
    hasCompletedTour: boolean;
    showChecklist: boolean;
    checklistProgress: ChecklistProgress;
  }>) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current = stored ? JSON.parse(stored) : {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...updates }));
  };

  const completeWelcome = () => {
    setHasCompletedWelcome(true);
    setShowWelcome(false);
    saveState({ hasCompletedWelcome: true });
  };

  const startTour = () => {
    setShowWelcome(false);
    setShowTour(true);
    setCurrentTourStep(0);
  };

  const nextTourStep = () => {
    if (currentTourStep < tourSteps.length - 1) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const prevTourStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(prev => prev - 1);
    }
  };

  const skipTour = () => {
    setShowTour(false);
    setHasCompletedTour(true);
    setShowChecklist(true);
    saveState({ hasCompletedTour: true, showChecklist: true });
  };

  const completeTour = () => {
    setShowTour(false);
    setHasCompletedTour(true);
    setShowChecklist(true);
    saveState({ hasCompletedTour: true, showChecklist: true });
  };

  const markChecklistItem = (itemId: string) => {
    const updated = { ...checklistProgress, [itemId]: true };
    setChecklistProgress(updated);
    saveState({ checklistProgress: updated });
  };

  const dismissChecklist = () => {
    setShowChecklist(false);
    saveState({ showChecklist: false });
  };

  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasCompletedWelcome(false);
    setHasCompletedTour(false);
    setShowWelcome(true);
    setShowTour(false);
    setShowChecklist(false);
    setChecklistProgress({});
    setCurrentTourStep(0);
  };

  return (
    <OnboardingContext.Provider value={{
      hasCompletedWelcome,
      hasCompletedTour,
      currentTourStep,
      tourSteps,
      showWelcome,
      showTour,
      showChecklist,
      checklistProgress,
      setShowWelcome,
      completeWelcome,
      startTour,
      nextTourStep,
      prevTourStep,
      skipTour,
      completeTour,
      resetOnboarding,
      markChecklistItem,
      dismissChecklist,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
