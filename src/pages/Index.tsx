import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRitual } from "@/hooks/useRitual";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RitualBanner } from "@/components/dashboard/RitualBanner";
import { FocusBlock } from "@/components/dashboard/FocusBlock";
import { TodayList } from "@/components/dashboard/TodayList";
import { EmptyDashboard } from "@/components/empty-states";
import { Confetti } from "@/components/shared";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import type { User } from "@/types/auth";

export default function Index() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
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

  const { pendingHabits } = useRitual();

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
  const hasContent = focusItems.length > 0 || overdueItems.length > 0 || dueTodayItems.length > 0 || ritualItems.length > 0;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Confetti celebration */}
      <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">{greeting}! 👋</h1>
        <p className="text-muted-foreground text-sm">
          {new Date().toLocaleDateString("pt-BR", { 
            weekday: "long", 
            day: "numeric", 
            month: "long" 
          })}
        </p>
      </motion.header>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <DashboardStats
          focusCount={focusItems.length}
          todayCount={dueTodayItems.length}
          overdueCount={overdueItems.length}
          habitsCount={pendingHabits.length}
        />
      </motion.div>

      {/* Dashboard Sections */}
      {!hasContent ? (
        <EmptyDashboard />
      ) : (
        <div className="space-y-4">
          {/* Focus Block - Hero prominence */}
          {focusItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <FocusBlock 
                items={focusItems} 
                onToggle={toggleComplete} 
              />
            </motion.div>
          )}

          {/* Ritual Banner - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RitualBanner 
              items={ritualItems} 
              currentSlot={currentSlot} 
              onToggle={toggleComplete} 
            />
          </motion.div>

          {/* Today List */}
          {(overdueItems.length > 0 || dueTodayItems.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <TodayList 
                overdueItems={overdueItems}
                dueTodayItems={dueTodayItems}
                onToggle={toggleComplete}
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
