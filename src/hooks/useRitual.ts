import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AtomItem, RitualSlot } from "@/types/atom-engine";

export type RitualPeriod = "aurora" | "zenite" | "crepusculo";

interface RitualConfig {
  period: RitualPeriod;
  slot: RitualSlot;
  label: string;
  phrase: string;
  icon: "sunrise" | "sun" | "sunset";
}

const ritualConfigs: Record<RitualPeriod, RitualConfig> = {
  aurora: {
    period: "aurora",
    slot: "manha",
    label: "Aurora",
    phrase: "Tudo começa com presença.",
    icon: "sunrise",
  },
  zenite: {
    period: "zenite",
    slot: "meio_dia",
    label: "Zênite",
    phrase: "O sol está no auge. Mantenha o foco.",
    icon: "sun",
  },
  crepusculo: {
    period: "crepusculo",
    slot: "noite",
    label: "Crepúsculo",
    phrase: "Hora de refletir e descansar.",
    icon: "sunset",
  },
};

function detectPeriod(hour: number): RitualPeriod {
  if (hour < 11) return "aurora";
  if (hour < 17) return "zenite";
  return "crepusculo";
}

export function useRitual(overridePeriod?: RitualPeriod) {
  const queryClient = useQueryClient();
  const [forcedPeriod, setForcedPeriod] = useState<RitualPeriod | null>(null);

  const currentHour = new Date().getHours();
  const detectedPeriod = detectPeriod(currentHour);
  const activePeriod = overridePeriod ?? forcedPeriod ?? detectedPeriod;
  const config = ritualConfigs[activePeriod];

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ["ritual-habits", config.slot],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "habit")
        .eq("ritual_slot", config.slot);

      if (error) throw error;

      return (data || []).map((item) => ({
        ...item,
        tags: item.tags || [],
        checklist: (item.checklist || []) as unknown as AtomItem["checklist"],
        weight: item.weight ?? 1,
      })) as AtomItem[];
    },
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      const newCompleted = !habit.completed;
      const { error } = await supabase
        .from("items")
        .update({
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
        })
        .eq("id", habitId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ritual-habits"] });
    },
  });

  const pendingHabits = useMemo(
    () => habits.filter((h) => !h.completed),
    [habits]
  );

  const completedHabits = useMemo(
    () => habits.filter((h) => h.completed),
    [habits]
  );

  const progress = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.round((completedHabits.length / habits.length) * 100);
  }, [habits, completedHabits]);

  return {
    // Period info
    activePeriod,
    detectedPeriod,
    config,
    
    // Debug controls
    forcedPeriod,
    setForcedPeriod,
    
    // Data
    habits,
    pendingHabits,
    completedHabits,
    progress,
    isLoading,
    
    // Actions
    toggleHabit: (id: string) => toggleHabitMutation.mutate(id),
  };
}
