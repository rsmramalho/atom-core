-- Drop the direct policy and use a security definer function instead
DROP POLICY "Project creator can add self as owner" ON public.project_members;

-- Create a function to check if user is the project creator
CREATE OR REPLACE FUNCTION public.is_project_creator(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.items
    WHERE id = _project_id
      AND user_id = _user_id
      AND type = 'project'
  )
$$;

-- Recreate policy using the security definer function
CREATE POLICY "Project creator can add self as owner"
ON public.project_members FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'owner'
  AND is_project_creator(auth.uid(), project_id)
);