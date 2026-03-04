-- Create a security definer function for owner self-registration
CREATE OR REPLACE FUNCTION public.ensure_project_owner(_project_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow the project creator to register as owner
  IF NOT EXISTS (
    SELECT 1 FROM public.items
    WHERE id = _project_id AND user_id = auth.uid() AND type = 'project'
  ) THEN
    RAISE EXCEPTION 'Not the project creator';
  END IF;

  -- Insert owner (ignore if already exists)
  INSERT INTO public.project_members (project_id, user_id, role)
  VALUES (_project_id, auth.uid(), 'owner')
  ON CONFLICT (project_id, user_id) DO NOTHING;
END;
$$;