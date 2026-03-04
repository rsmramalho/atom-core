
-- Viewers should NOT be able to create or update items in shared projects.
-- The existing "Members can create items" and "Members can update shared project items" 
-- policies use is_project_member which includes viewers.
-- We need to replace them with policies that check for owner/editor only.

-- Drop existing permissive INSERT/UPDATE policies for shared items
DROP POLICY IF EXISTS "Members can create items in shared projects" ON public.items;
DROP POLICY IF EXISTS "Members can update shared project items" ON public.items;

-- Create a helper function to check if user is owner or editor (not viewer)
CREATE OR REPLACE FUNCTION public.is_project_editor(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE user_id = _user_id AND project_id = _project_id AND role IN ('owner', 'editor')
  )
$$;

-- Recreate INSERT policy: only owner/editor can create items
CREATE POLICY "Members can create items in shared projects"
ON public.items FOR INSERT TO authenticated
WITH CHECK (project_id IS NOT NULL AND is_project_editor(auth.uid(), project_id));

-- Recreate UPDATE policy: only owner/editor can update items
CREATE POLICY "Members can update shared project items"
ON public.items FOR UPDATE TO authenticated
USING (project_id IS NOT NULL AND is_project_editor(auth.uid(), project_id));
