CREATE POLICY "Editors can delete shared project items"
ON public.items
FOR DELETE
TO authenticated
USING (
  project_id IS NOT NULL
  AND is_project_editor(auth.uid(), project_id)
);