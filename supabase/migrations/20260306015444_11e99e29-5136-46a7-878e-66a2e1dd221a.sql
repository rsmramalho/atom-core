
-- Drop the overly permissive DELETE policy
DROP POLICY IF EXISTS "Authenticated users can delete error logs" ON public.error_logs;

-- Restrict DELETE to admins only
CREATE POLICY "Admins can delete error logs"
ON public.error_logs
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Also restrict SELECT to admins only
DROP POLICY IF EXISTS "Authenticated users can view error logs" ON public.error_logs;

CREATE POLICY "Admins can view error logs"
ON public.error_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow INSERT for any authenticated user (error reporting)
CREATE POLICY "Authenticated users can insert error logs"
ON public.error_logs
FOR INSERT
TO authenticated
WITH CHECK (true);
