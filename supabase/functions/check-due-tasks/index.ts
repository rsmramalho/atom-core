import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    // Get all uncompleted items with due dates <= tomorrow
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, user_id, title, due_date, type, tags")
      .eq("completed", false)
      .lte("due_date", tomorrowStr)
      .not("type", "eq", "reflection");

    if (itemsError) {
      return new Response(JSON.stringify({ error: itemsError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: "No due items found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Group by user
    const userItems = new Map<string, { overdue: number; today: number; tomorrow: number }>();

    for (const item of items) {
      // Skip milestones
      if (item.tags && Array.isArray(item.tags) && item.tags.includes("#milestone")) continue;

      if (!userItems.has(item.user_id)) {
        userItems.set(item.user_id, { overdue: 0, today: 0, tomorrow: 0 });
      }
      const counts = userItems.get(item.user_id)!;

      if (item.due_date < todayStr) {
        counts.overdue++;
      } else if (item.due_date === todayStr) {
        counts.today++;
      } else if (item.due_date === tomorrowStr) {
        counts.tomorrow++;
      }
    }

    // Send push notification to each user
    let notified = 0;
    for (const [userId, counts] of userItems.entries()) {
      const parts: string[] = [];
      if (counts.overdue > 0) parts.push(`${counts.overdue} atrasada${counts.overdue > 1 ? "s" : ""}`);
      if (counts.today > 0) parts.push(`${counts.today} para hoje`);
      if (counts.tomorrow > 0) parts.push(`${counts.tomorrow} para amanhã`);

      if (parts.length === 0) continue;

      // Call send-push-notification function
      const { error: fnError } = await supabase.functions.invoke("send-push-notification", {
        body: {
          user_id: userId,
          title: "🔔 MindMate - Lembretes",
          body: `Você tem: ${parts.join(", ")}`,
          url: "/app",
        },
      });

      if (!fnError) notified++;
    }

    return new Response(
      JSON.stringify({ processed: userItems.size, notified }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
