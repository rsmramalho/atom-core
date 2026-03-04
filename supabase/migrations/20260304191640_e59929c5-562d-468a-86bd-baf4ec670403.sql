
-- Allow owners to update member roles (but not their own, and not to 'owner')
CREATE POLICY "Owners can update member roles"
  ON public.project_members FOR UPDATE
  USING (public.is_project_owner(auth.uid(), project_id) AND user_id != auth.uid())
  WITH CHECK (public.is_project_owner(auth.uid(), project_id) AND role IN ('editor', 'viewer'));
