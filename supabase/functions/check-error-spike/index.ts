import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ERROR_THRESHOLD = 5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Count errors in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("error_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneHourAgo);

    if (countError) {
      throw new Error(`Failed to count errors: ${countError.message}`);
    }

    const errorCount = count ?? 0;

    if (errorCount < ERROR_THRESHOLD) {
      return new Response(
        JSON.stringify({ alert: false, count: errorCount, threshold: ERROR_THRESHOLD }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Spike detected — get all users with push subscriptions to notify
    const { data: subscribers, error: subError } = await supabase
      .from("push_subscriptions")
      .select("user_id")
      .limit(100);

    if (subError) {
      throw new Error(`Failed to fetch subscribers: ${subError.message}`);
    }

    // Deduplicate user IDs
    const uniqueUserIds = [...new Set(subscribers?.map((s) => s.user_id) ?? [])];

    // Send push notification to each user
    const pushResults = await Promise.allSettled(
      uniqueUserIds.map(async (userId) => {
        const response = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({
            user_id: userId,
            title: "⚠️ Spike de Erros Detectado",
            body: `${errorCount} erros na última hora (limite: ${ERROR_THRESHOLD}). Verifique o dashboard.`,
            url: "/admin/errors",
          }),
        });
        return { userId, ok: response.ok };
      })
    );

    const notified = pushResults.filter(
      (r) => r.status === "fulfilled" && r.value.ok
    ).length;

    return new Response(
      JSON.stringify({
        alert: true,
        count: errorCount,
        threshold: ERROR_THRESHOLD,
        notified_users: notified,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("check-error-spike error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
