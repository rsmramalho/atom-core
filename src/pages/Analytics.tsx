import { useMemo } from "react";
import { useAtomItems } from "@/hooks/useAtomItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Target, 
  Flame, 
  Calendar,
  TrendingUp,
  ListTodo,
  Repeat,
  BookOpen
} from "lucide-react";
import { format, subDays, isAfter, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { calculateStreak, getLongestStreak } from "@/lib/recurrence-engine";

export default function Analytics() {
  const { items } = useAtomItems();

  const stats = useMemo(() => {
    const tasks = items.filter(i => i.type === "task");
    const habits = items.filter(i => i.type === "habit");
    const projects = items.filter(i => i.type === "project");
    const reflections = items.filter(i => i.type === "reflection");

    const completedTasks = tasks.filter(i => i.completed);
    const activeTasks = tasks.filter(i => !i.completed);
    const activeProjects = projects.filter(i => i.project_status === "active");
    const completedProjects = projects.filter(i => i.project_status === "completed");

    // Tasks completed in last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(date);
      const completedOnDay = completedTasks.filter(t => {
        if (!t.completed_at) return false;
        const completedDate = startOfDay(parseISO(t.completed_at));
        return completedDate.getTime() === dayStart.getTime();
      });
      return {
        day: format(date, "EEE", { locale: ptBR }),
        date: format(date, "dd/MM"),
        completed: completedOnDay.length
      };
    });

    // Habit streaks
    const habitStreaks = habits.map(habit => {
      const log = Array.isArray(habit.completion_log) ? habit.completion_log as string[] : [];
      return {
        title: habit.title,
        currentStreak: calculateStreak(log),
        longestStreak: getLongestStreak(log),
        totalCompletions: log.length
      };
    }).sort((a, b) => b.currentStreak - a.currentStreak);

    // Items by module
    const moduleStats = items.reduce((acc, item) => {
      const module = item.module || "geral";
      if (!acc[module]) acc[module] = 0;
      acc[module]++;
      return acc;
    }, {} as Record<string, number>);

    const moduleData = Object.entries(moduleStats).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    // Completion rate
    const totalActionable = tasks.length;
    const completionRate = totalActionable > 0 
      ? Math.round((completedTasks.length / totalActionable) * 100) 
      : 0;

    return {
      tasks: {
        total: tasks.length,
        completed: completedTasks.length,
        active: activeTasks.length
      },
      habits: {
        total: habits.length,
        streaks: habitStreaks
      },
      projects: {
        total: projects.length,
        active: activeProjects.length,
        completed: completedProjects.length
      },
      reflections: reflections.length,
      last7Days,
      moduleData,
      completionRate
    };
  }, [items]);

  const moduleColors = {
    Work: "hsl(var(--chart-1))",
    Body: "hsl(var(--chart-2))",
    Mind: "hsl(var(--chart-3))",
    Family: "hsl(var(--chart-4))",
    Geral: "hsl(var(--chart-5))"
  };

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Estatísticas</h1>
        <p className="text-muted-foreground">Visão geral do seu progresso</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.tasks.completed}</p>
                <p className="text-xs text-muted-foreground">Tarefas concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.habits.streaks[0]?.currentStreak || 0}
                </p>
                <p className="text-xs text-muted-foreground">Maior streak ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.projects.active}</p>
                <p className="text-xs text-muted-foreground">Projetos ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.reflections}</p>
                <p className="text-xs text-muted-foreground">Reflexões</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Atividade Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: {
                  label: "Concluídas",
                  color: "hsl(var(--primary))"
                }
              }}
              className="h-[200px]"
            >
              <BarChart data={stats.last7Days}>
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="completed" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Module Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Distribuição por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Items" }
              }}
              className="h-[200px]"
            >
              <PieChart>
                <Pie
                  data={stats.moduleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name }) => name}
                >
                  {stats.moduleData.map((entry, index) => (
                    <Cell 
                      key={entry.name} 
                      fill={moduleColors[entry.name as keyof typeof moduleColors] || `hsl(var(--chart-${(index % 5) + 1}))`} 
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Taxa de Conclusão de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{stats.tasks.completed} de {stats.tasks.total} tarefas</span>
            <span className="font-medium">{stats.completionRate}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
        </CardContent>
      </Card>

      {/* Habit Streaks */}
      {stats.habits.streaks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Streaks de Hábitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.habits.streaks.slice(0, 5).map((habit) => (
                <div key={habit.title} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{habit.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {habit.totalCompletions} conclusões totais
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-orange-500">{habit.currentStreak}</p>
                      <p className="text-xs text-muted-foreground">Atual</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-primary">{habit.longestStreak}</p>
                      <p className="text-xs text-muted-foreground">Recorde</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
