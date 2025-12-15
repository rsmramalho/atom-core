import { useNavigate } from "react-router-dom";
import { Sunrise, Sun, Sunset, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRitual, RitualPeriod } from "@/hooks/useRitual";
import { cn } from "@/lib/utils";

const periodIcons = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
};

const periodStyles: Record<RitualPeriod, { bg: string; text: string; card: string }> = {
  aurora: {
    bg: "bg-ritual-aurora-bg",
    text: "text-ritual-aurora-fg",
    card: "bg-white/40 border-ritual-aurora-fg/20",
  },
  zenite: {
    bg: "bg-ritual-zenite-bg",
    text: "text-ritual-zenite-fg",
    card: "bg-white/50 border-ritual-zenite-fg/20",
  },
  crepusculo: {
    bg: "bg-ritual-crepusculo-bg",
    text: "text-ritual-crepusculo-fg",
    card: "bg-white/30 border-ritual-crepusculo-fg/20",
  },
};

export default function RitualView() {
  const navigate = useNavigate();
  const {
    activePeriod,
    config,
    habits,
    progress,
    isLoading,
    toggleHabit,
    forcedPeriod,
    setForcedPeriod,
  } = useRitual();

  const styles = periodStyles[activePeriod];
  const Icon = periodIcons[config.icon];

  const handleClose = () => {
    navigate("/");
  };

  // Dev mode period selector
  const isDev = import.meta.env.DEV;

  return (
    <div className={cn("min-h-screen flex flex-col", styles.bg, styles.text)}>
      {/* Dev Period Selector */}
      {isDev && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-xs mr-2 self-center">DEV:</span>
          {(["aurora", "zenite", "crepusculo"] as RitualPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setForcedPeriod(forcedPeriod === p ? null : p)}
              className={cn(
                "px-2 py-1 text-xs rounded border transition-all",
                forcedPeriod === p
                  ? "border-current bg-black/10"
                  : "border-current/30 hover:border-current/60"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Header */}
      <header className="flex flex-col items-center justify-center pt-16 pb-8">
        <div className="p-4 rounded-full bg-white/30 mb-6">
          <Icon className="h-16 w-16" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Ritual {config.label}</h1>
        <p className="text-lg opacity-80 italic">{config.phrase}</p>
      </header>

      {/* Progress */}
      <div className="px-8 py-4 max-w-md mx-auto w-full">
        <div className="flex justify-between text-sm mb-2">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-black/10" />
      </div>

      {/* Habits List */}
      <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full">
        {isLoading ? (
          <div className="text-center opacity-60">Carregando hábitos...</div>
        ) : habits.length === 0 ? (
          <div className="text-center opacity-60">
            <p className="mb-2">Nenhum hábito para este ritual.</p>
            <p className="text-sm">
              Adicione hábitos com ritual_slot = "{config.slot}" no Inbox.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <Card
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "p-6 cursor-pointer border-2 transition-all duration-300",
                  styles.card,
                  habit.completed && "opacity-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                      habit.completed
                        ? "bg-green-500 border-green-500"
                        : "border-current"
                    )}
                  >
                    {habit.completed && <Check className="h-5 w-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "text-xl font-medium transition-all",
                        habit.completed && "line-through"
                      )}
                    >
                      {habit.title}
                    </h3>
                    {habit.notes && (
                      <p className="text-sm opacity-70 mt-1">{habit.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer - Fixed on mobile for thumb access */}
      <footer className="p-6 md:p-8 flex justify-center sticky bottom-0 bg-gradient-to-t from-current/5 to-transparent backdrop-blur-sm">
        <Button
          onClick={handleClose}
          size="lg"
          className="bg-black/20 hover:bg-black/30 text-current border-2 border-current/30 min-w-[200px] h-14 text-lg shadow-lg"
        >
          Encerrar Ritual
        </Button>
      </footer>
    </div>
  );
}
