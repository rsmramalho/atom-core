-- 1. Attach the existing handle_new_user function as a trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Cascade deletes: when a project (item) is deleted, clean up related data
ALTER TABLE public.project_members
  DROP CONSTRAINT IF EXISTS project_members_project_id_fkey,
  ADD CONSTRAINT project_members_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES public.items(id) ON DELETE CASCADE;

ALTER TABLE public.project_invites
  DROP CONSTRAINT IF EXISTS project_invites_project_id_fkey,
  ADD CONSTRAINT project_invites_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES public.items(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'project_activities_project_id_fkey'
    AND table_name = 'project_activities'
  ) THEN
    ALTER TABLE public.project_activities
      ADD CONSTRAINT project_activities_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.items(id) ON DELETE CASCADE;
  ELSE
    ALTER TABLE public.project_activities
      DROP CONSTRAINT project_activities_project_id_fkey,
      ADD CONSTRAINT project_activities_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES public.items(id) ON DELETE CASCADE;
  END IF;
END $$;
