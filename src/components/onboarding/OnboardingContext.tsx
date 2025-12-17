import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  isLoading: boolean;
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

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(true);
  const [hasCompletedTour, setHasCompletedTour] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistProgress, setChecklistProgress] = useState<ChecklistProgress>({});
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Load onboarding state from Supabase
  useEffect(() => {
    const loadOnboardingState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setUserId(user.id);

      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading onboarding state:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setHasCompletedWelcome(data.has_completed_welcome);
        setHasCompletedTour(data.has_completed_tour);
        setShowChecklist(data.show_checklist);
        setChecklistProgress((data.checklist_progress as ChecklistProgress) ?? {});
        
        // Show welcome if not completed
        if (!data.has_completed_welcome) {
          setShowWelcome(true);
        }
      } else {
        // First time user - create initial record
        const { error: insertError } = await supabase
          .from('onboarding_progress')
          .insert({
            user_id: user.id,
            has_completed_welcome: false,
            has_completed_tour: false,
            show_checklist: false,
            checklist_progress: {}
          });

        if (insertError) {
          console.error('Error creating onboarding record:', insertError);
        }

        setHasCompletedWelcome(false);
        setHasCompletedTour(false);
        setShowWelcome(true);
      }
      
      setIsLoading(false);
    };

    loadOnboardingState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserId(session.user.id);
        loadOnboardingState();
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setHasCompletedWelcome(true);
        setHasCompletedTour(true);
        setShowWelcome(false);
        setShowTour(false);
        setShowChecklist(false);
        setChecklistProgress({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const trackEvent = async (eventType: string, eventData: Record<string, unknown> = {}) => {
    if (!userId) return;

    const { error } = await supabase
      .from('onboarding_analytics')
      .insert([{
        user_id: userId,
        event_type: eventType,
        event_data: eventData as import("@/integrations/supabase/types").Json
      }]);

    if (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  const saveState = async (updates: {
    has_completed_welcome?: boolean;
    has_completed_tour?: boolean;
    show_checklist?: boolean;
    checklist_progress?: ChecklistProgress;
  }) => {
    if (!userId) return;

    const { error } = await supabase
      .from('onboarding_progress')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      console.error('Error saving onboarding state:', error);
    }
  };

  const completeWelcome = () => {
    setHasCompletedWelcome(true);
    setShowWelcome(false);
    saveState({ has_completed_welcome: true });
    trackEvent('welcome_completed');
  };

  const startTour = () => {
    setShowWelcome(false);
    setShowTour(true);
    setCurrentTourStep(0);
    trackEvent('tour_started');
  };

  const nextTourStep = () => {
    if (currentTourStep < tourSteps.length - 1) {
      const nextStep = currentTourStep + 1;
      setCurrentTourStep(nextStep);
      trackEvent('tour_step_viewed', { step: nextStep, stepId: tourSteps[nextStep].id });
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
    saveState({ has_completed_tour: true, show_checklist: true });
    trackEvent('tour_skipped', { skippedAtStep: currentTourStep });
  };

  const completeTour = () => {
    setShowTour(false);
    setHasCompletedTour(true);
    setShowChecklist(true);
    saveState({ has_completed_tour: true, show_checklist: true });
    trackEvent('tour_completed');
  };

  const markChecklistItem = (itemId: string) => {
    const updated = { ...checklistProgress, [itemId]: true };
    setChecklistProgress(updated);
    saveState({ checklist_progress: updated });
    trackEvent('checklist_item_completed', { itemId });
    
    // Track when all checklist items are completed
    const allItemIds = ['create_project', 'add_task', 'complete_ritual', 'write_reflection'];
    const completedCount = allItemIds.filter(id => updated[id]).length;
    if (completedCount === allItemIds.length) {
      trackEvent('checklist_all_completed');
    }
  };

  const dismissChecklist = () => {
    setShowChecklist(false);
    saveState({ show_checklist: false });
    trackEvent('checklist_dismissed');
  };

  const resetOnboarding = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('onboarding_progress')
      .update({
        has_completed_welcome: false,
        has_completed_tour: false,
        show_checklist: false,
        checklist_progress: {}
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error resetting onboarding:', error);
      return;
    }

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
      isLoading,
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
