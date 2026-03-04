-- Allow project creator to bootstrap themselves as owner
-- The items table owner (user_id) should be able to add themselves as the first member
CREATE POLICY "Project creator can add self as owner"
ON public.project_members FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'owner'
  AND EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = project_id
      AND items.user_id = auth.uid()
      AND items.type = 'project'
  )
);