
-- Error logs table for production error tracking
CREATE TABLE public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid,
  error_message text NOT NULL,
  error_stack text,
  component_stack text,
  url text,
  user_agent text,
  app_version text,
  error_type text DEFAULT 'uncaught',
  metadata jsonb
);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Only allow inserts via edge function (service_role), no direct client access
-- Admins could read via service_role in edge function

-- Index for querying recent errors
CREATE INDEX idx_error_logs_created_at ON public.error_logs (created_at DESC);
CREATE INDEX idx_error_logs_error_type ON public.error_logs (error_type);
