import { CheckCircle2, Target, Flame, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  focusCount: number;
  todayCount: number;
  overdueCount: number;
  habitsCount: number;
}

export function DashboardStats({ 
  focusCount, 
  todayCount, 
  overdueCount, 
  habitsCount 
}: DashboardStatsProps) {
  const stats = [
    { 
      label: "Foco", 
      value: focusCount, 
      icon: Target, 
      color: "text-primary",
      bg: "bg-primary/10"
    },
    { 
      label: "Hoje", 
      value: todayCount, 
      icon: Calendar, 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      label: "Atrasadas", 
      value: overdueCount, 
      icon: CheckCircle2, 
      color: overdueCount > 0 ? "text-destructive" : "text-muted-foreground",
      bg: overdueCount > 0 ? "bg-destructive/10" : "bg-muted/50"
    },
    { 
      label: "Hábitos", 
      value: habitsCount, 
      icon: Flame, 
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`${stat.bg} rounded-xl p-3 md:p-4 text-center`}
        >
          <stat.icon className={`h-4 w-4 md:h-5 md:w-5 mx-auto mb-1 ${stat.color}`} />
          <div className={`text-lg md:text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-[10px] md:text-xs text-muted-foreground truncate">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
