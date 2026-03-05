import { supabase } from "@/integrations/supabase/client";

const APP_VERSION = "4.0.0-beta.1";
const REPORT_QUEUE: Array<Record<string, unknown>> = [];
let isProcessing = false;

async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function sendErrorReport(payload: Record<string, unknown>) {
  try {
    await supabase.functions.invoke("report-error", {
      body: payload,
    });
  } catch {
    // Silently fail — error tracking should never break the app
  }
}

async function processQueue() {
  if (isProcessing || REPORT_QUEUE.length === 0) return;
  isProcessing = true;

  while (REPORT_QUEUE.length > 0) {
    const payload = REPORT_QUEUE.shift();
    if (payload) await sendErrorReport(payload);
  }

  isProcessing = false;
}

function enqueue(payload: Record<string, unknown>) {
  // Deduplicate by message within the same session
  const isDuplicate = REPORT_QUEUE.some(
    (p) => p.error_message === payload.error_message
  );
  if (isDuplicate) return;

  REPORT_QUEUE.push(payload);
  processQueue();
}

/** Report a caught error (e.g. from ErrorBoundary) */
export async function reportError(
  error: Error,
  options?: {
    componentStack?: string;
    errorType?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const userId = await getCurrentUserId();

  enqueue({
    error_message: error.message,
    error_stack: error.stack,
    component_stack: options?.componentStack,
    url: window.location.href,
    user_agent: navigator.userAgent,
    app_version: APP_VERSION,
    error_type: options?.errorType ?? "boundary",
    metadata: options?.metadata,
    user_id: userId,
  });
}

/** Initialize global error handlers — call once in main.tsx */
export function initErrorTracking() {
  // Uncaught errors
  window.addEventListener("error", async (event) => {
    const userId = await getCurrentUserId();
    enqueue({
      error_message: event.message || "Unknown error",
      error_stack: event.error?.stack,
      url: window.location.href,
      user_agent: navigator.userAgent,
      app_version: APP_VERSION,
      error_type: "uncaught",
      user_id: userId,
    });
  });

  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", async (event) => {
    const userId = await getCurrentUserId();
    const reason = event.reason;
    enqueue({
      error_message:
        reason instanceof Error
          ? reason.message
          : String(reason ?? "Unhandled promise rejection"),
      error_stack: reason instanceof Error ? reason.stack : undefined,
      url: window.location.href,
      user_agent: navigator.userAgent,
      app_version: APP_VERSION,
      error_type: "unhandled_rejection",
      user_id: userId,
    });
  });
}
