import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { useDashboardData } from "@/hooks/useDashboardData";
import { RitualBanner } from "@/components/dashboard/RitualBanner";
import { FocusBlock } from "@/components/dashboard/FocusBlock";
import { TodayList } from "@/components/dashboard/TodayList";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {
    isLoading,
    focusItems,
    overdueItems,
    dueTodayItems,
    ritualItems,
    currentSlot,
    toggleComplete,
  } = useDashboardData();

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

        {/* Today List */}
        <TodayList 
          overdueItems={overdueItems}
          dueTodayItems={dueTodayItems}
          onToggle={toggleComplete}
        />
      </div>
    </div>
  );
}