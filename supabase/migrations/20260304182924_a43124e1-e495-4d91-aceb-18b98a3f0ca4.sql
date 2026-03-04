-- Drop the buggy policy and recreate with correct reference
DROP POLICY "Project creator can add self as owner" ON public.project_members;

CREATE POLICY "Project creator can add self as owner"
ON public.project_members FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'owner'
  AND EXISTS (
    SELECT 1 FROM public.items
    WHERE items.id = project_members.project_id
      AND items.user_id = auth.uid()
      AND items.type = 'project'
  )
);