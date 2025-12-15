import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRitual } from "@/hooks/useRitual";
import { RitualBanner } from "@/components/dashboard/RitualBanner";
import { FocusBlock } from "@/components/dashboard/FocusBlock";
import { TodayList } from "@/components/dashboard/TodayList";
import { EmptyDashboard } from "@/components/empty-states";
import { Confetti } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Loader2, Sunrise, Sun, Sunset } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const periodIcons = {
  aurora: Sunrise,
  zenite: Sun,
  crepusculo: Sunset,
};

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Track previous pending count to detect completion
  const prevPendingCountRef = useRef<number | null>(null);

  const {
    isLoading,
    focusItems,
    overdueItems,
    dueTodayItems,
    ritualItems,
    currentSlot,
    toggleComplete,
  } = useDashboardData();

  const { activePeriod, config, pendingHabits } = useRitual();
  const PeriodIcon = periodIcons[activePeriod];

  // Calculate total pending items (excluding ritual items as they have their own flow)
  const totalPendingItems = focusItems.length + overdueItems.length + dueTodayItems.length;

  // Detect when all tasks are completed
  useEffect(() => {
    // Skip on initial load or when loading
    if (isLoading || prevPendingCountRef.current === null) {
      prevPendingCountRef.current = totalPendingItems;
      return;
    }

    // Check if we went from having items to zero
    if (prevPendingCountRef.current > 0 && totalPendingItems === 0) {
      setShowConfetti(true);
      toast({
        title: "🎉 Parabéns!",
        description: "Você completou todas as tarefas do dia!",
      });
    }

    prevPendingCountRef.current = totalPendingItems;
  }, [totalPendingItems, isLoading, toast]);

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">MindMate</h1>
            <p className="text-muted-foreground">Atom Engine 4.0</p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Confetti celebration */}
      <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{greeting}! 👋</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("pt-BR", { 
            weekday: "long", 
            day: "numeric", 
            month: "long" 
          })}
        </p>
      </header>

      {/* Ritual Entry Button */}
      <Button
        onClick={() => navigate("/ritual")}
        variant={pendingHabits.length > 0 ? "default" : "outline"}
        className="w-full mb-6 py-6 text-lg gap-3"
      >
        <PeriodIcon className="h-6 w-6" />
        {pendingHabits.length > 0 
          ? `Ritual ${config.label} Pendente (${pendingHabits.length})`
          : `Entrar no Ritual ${config.label}`
        }
      </Button>

      {/* Dashboard Sections */}
      <div className="space-y-6">
        {/* Ritual Banner */}
        <RitualBanner 
          items={ritualItems} 
          currentSlot={currentSlot} 
          onToggle={toggleComplete} 
        />

        {/* Focus Block */}
        <FocusBlock 
          items={focusItems} 
          onToggle={toggleComplete} 
        />

        {/* Today List or Empty Dashboard */}
        {overdueItems.length === 0 && dueTodayItems.length === 0 && focusItems.length === 0 && ritualItems.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <TodayList 
            overdueItems={overdueItems}
            dueTodayItems={dueTodayItems}
            onToggle={toggleComplete}
          />
        )}
      </div>
    </div>
  );
}
