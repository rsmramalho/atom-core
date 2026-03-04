import { useProjectActivities, type ProjectActivity } from "@/hooks/useProjectActivities";
import { 
  ListTodo, Flag, ListChecks, CheckCircle2, Users, 
  Activity, ArrowRightLeft, Feather, Loader2 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const ACTION_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  task_created:       { icon: ListTodo,      label: "criou task",          color: "text-primary" },
  task_completed:     { icon: CheckCircle2,  label: "completou task",     color: "text-green-500" },
  milestone_created:  { icon: Flag,          label: "criou milestone",    color: "text-amber-500" },
  milestone_completed:{ icon: Flag,          label: "completou milestone",color: "text-green-500" },
  list_created:       { icon: ListChecks,    label: "criou lista",        color: "text-blue-500" },
  member_joined:      { icon: Users,         label: "entrou no projeto",  color: "text-violet-500" },
  status_changed:     { icon: ArrowRightLeft,label: "alterou status",     color: "text-orange-500" },
  note_created:       { icon: Feather,       label: "criou nota",         color: "text-cyan-500" },
};

function ActivityItem({ activity }: { activity: ProjectActivity }) {
  const config = ACTION_CONFIG[activity.action] || { icon: Activity, label: activity.action, color: "text-muted-foreground" };
  const Icon = config.icon;
  const email = (activity.metadata as Record<string, unknown>)?.user_email as string | undefined;

  return (
    <div className="flex gap-3 py-3">
      <div className={cn("flex-shrink-0 mt-0.5 p-1.5 rounded-full bg-muted", config.color)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm">
          <span className="font-medium">{email || "Membro"}</span>{" "}
          <span className="text-muted-foreground">{config.label}</span>
          {activity.target_title && (
            <span className="font-medium"> "{activity.target_title}"</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: ptBR })}
        </p>
      </div>
    </div>
  );
}

interface ActivityPaneProps {
  projectId: string;
}

export function ActivityPane({ projectId }: ActivityPaneProps) {
  const { data: activities, isLoading } = useProjectActivities(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12 space-y-2">
        <Activity className="h-10 w-10 text-muted-foreground/40 mx-auto" />
        <p className="text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>
        <p className="text-xs text-muted-foreground/60">
          Ações como criar tasks, completar itens e novos membros aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {activities.map((a) => (
        <ActivityItem key={a.id} activity={a} />
      ))}
    </div>
  );
}
