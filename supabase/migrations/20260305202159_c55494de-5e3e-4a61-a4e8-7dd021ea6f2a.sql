
-- =============================================
-- SECURITY AUDIT FIX: Critical RLS hardening
-- =============================================

-- 1. FIX CRITICAL: Profiles - restrict SELECT to own profile + co-project-members
-- First create a security definer function to check co-membership
CREATE OR REPLACE FUNCTION public.is_project_co_member(_viewer_id uuid, _target_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members pm1
    JOIN public.project_members pm2 ON pm1.project_id = pm2.project_id
    WHERE pm1.user_id = _viewer_id
      AND pm2.user_id = _target_id
  )
$$;

-- Drop the overly permissive profiles SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Replace with restrictive policy: own profile OR co-project-member
CREATE POLICY "Users can view own or co-member profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR public.is_project_co_member(auth.uid(), id)
);

-- 2. FIX CRITICAL: Project invites - remove "anyone can read" policy
DROP POLICY IF EXISTS "Anyone can read invite by code" ON public.project_invites;

-- 3. FIX WARN: Add UPDATE policy on push_subscriptions
CREATE POLICY "Users can update own push subscriptions"
ON public.push_subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. FIX WARN: Add DELETE policy on onboarding_analytics (GDPR compliance)
CREATE POLICY "Users can delete own analytics"
ON public.onboarding_analytics
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 5. FIX INFO: Add DELETE policy on profiles (GDPR right to erasure)
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);
