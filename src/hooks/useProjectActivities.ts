import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectActivity {
  id: string;
  project_id: string;
  user_id: string;
  action: string;
  target_title: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function useProjectActivities(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-activities", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_activities")
        .select("*")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data ?? []) as ProjectActivity[];
    },
  });
}

export async function logProjectActivity(
  projectId: string,
  action: string,
  targetTitle?: string,
  metadata?: Record<string, unknown>
) {
  try {
    await supabase.rpc("log_project_activity", {
      _project_id: projectId,
      _action: action,
      _target_title: targetTitle ?? null,
      _metadata: (metadata ?? {}) as unknown as Record<string, never>,
    });
  } catch (e) {
    console.warn("Failed to log activity:", e);
  }
}
