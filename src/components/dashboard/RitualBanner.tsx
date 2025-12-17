import { Sunrise, Sun, Moon, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StreakBadge } from "@/components/shared/StreakBadge";
import { HabitHeatmap } from "@/components/shared/HabitHeatmap";
import { motion } from "framer-motion";
import type { AtomItem, RitualSlot } from "@/types/atom-engine";

interface RitualBannerProps {
  items: AtomItem[];
  currentSlot: RitualSlot;
  onToggle: (id: string) => void;
}

const slotConfig: Record<string, { icon: typeof Sunrise; label: string; color: string; bg: string }> = {
  manha: { 
    icon: Sunrise, 
    label: "Aurora",
    color: "text-amber-500",
    bg: "bg-amber-500/10 hover:bg-amber-500/20"
  },
  meio_dia: { 
    icon: Sun, 
    label: "Zênite",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10 hover:bg-yellow-500/20"
  },
  noite: { 
    icon: Moon, 
    label: "Crepúsculo",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 hover:bg-indigo-500/20"
  },
};

export function RitualBanner({ items, currentSlot, onToggle }: RitualBannerProps) {
  const navigate = useNavigate();
  
  if (!currentSlot) return null;

  const config = slotConfig[currentSlot];
  const Icon = config.icon;
  const pendingCount = items.filter(i => !i.completed).length;
  const completedCount = items.filter(i => i.completed).length;

  // Compact banner when no items or all completed
  if (items.length === 0 || pendingCount === 0) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate("/ritual")}
        className={`w-full ${config.bg} rounded-xl p-4 flex items-center justify-between transition-colors group`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <span className="font-medium">Ritual {config.label}</span>
          {completedCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {completedCount} completo{completedCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bg} rounded-xl p-4 transition-colors`}
    >
      <button
        onClick={() => navigate("/ritual")}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <span className="font-medium">Ritual {config.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
            {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </button>
      
      <div className="space-y-1">
        {items.slice(0, 3).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors"
          >
            <button
              onClick={() => onToggle(item.id)}
              className="flex-shrink-0"
            >
              {item.completed ? (
                <CheckCircle2 className={`h-5 w-5 ${config.color}`} />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>
            <span className={`flex-1 text-left text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
              {item.title}
            </span>
            {item.completion_log && item.completion_log.length > 0 && (
              <HabitHeatmap 
                habitTitle={item.title}
                completionLog={item.completion_log}
                trigger={<StreakBadge completionLog={item.completion_log} compact className="cursor-pointer hover:scale-105 transition-transform" />}
              />
            )}
          </motion.div>
        ))}
        {items.length > 3 && (
          <button
            onClick={() => navigate("/ritual")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors pl-10"
          >
            +{items.length - 3} mais...
          </button>
        )}
      </div>
    </motion.div>
  );
}
