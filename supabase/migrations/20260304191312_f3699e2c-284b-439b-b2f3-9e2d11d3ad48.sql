
-- Table
CREATE TABLE public.project_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  action text NOT NULL,
  target_title text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;

-- RLS: members can read
CREATE POLICY "Members can view project activities"
  ON public.project_activities FOR SELECT
  USING (public.is_project_member(auth.uid(), project_id));

-- RLS: members can insert their own activities
CREATE POLICY "Members can insert own activities"
  ON public.project_activities FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.is_project_member(auth.uid(), project_id)
  );

-- Security definer function for logging (also used by accept_project_invite where user may not yet be member)
CREATE OR REPLACE FUNCTION public.log_project_activity(
  _project_id uuid,
  _action text,
  _target_title text DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.project_activities (project_id, user_id, action, target_title, metadata)
  VALUES (_project_id, auth.uid(), _action, _target_title, _metadata);
END;
$$;

-- Index for fast lookups
CREATE INDEX idx_project_activities_project_id ON public.project_activities (project_id, created_at DESC);
