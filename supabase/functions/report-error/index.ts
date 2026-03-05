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
    const body = await req.json();

    const {
      error_message,
      error_stack,
      component_stack,
      url,
      user_agent,
      app_version,
      error_type,
      metadata,
      user_id,
    } = body;

    if (!error_message) {
      return new Response(
        JSON.stringify({ error: "error_message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("error_logs").insert({
      error_message: String(error_message).slice(0, 2000),
      error_stack: error_stack ? String(error_stack).slice(0, 5000) : null,
      component_stack: component_stack ? String(component_stack).slice(0, 5000) : null,
      url: url ? String(url).slice(0, 500) : null,
      user_agent: user_agent ? String(user_agent).slice(0, 500) : null,
      app_version: app_version || null,
      error_type: error_type || "uncaught",
      metadata: metadata || null,
      user_id: user_id || null,
    });

    if (error) {
      console.error("Failed to insert error log:", error);
      return new Response(
        JSON.stringify({ error: "Failed to log error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in report-error function:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
