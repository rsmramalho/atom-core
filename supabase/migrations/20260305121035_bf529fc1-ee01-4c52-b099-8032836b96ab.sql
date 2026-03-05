-- Fix push_subscriptions: restrict service-role-only policies to authenticated role only
-- The "true" policies are too permissive for anon users

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Service role can read all push subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Service role can delete push subscriptions" ON public.push_subscriptions;

-- These operations are handled by edge functions using the service_role key,
-- which bypasses RLS entirely. No need for permissive "true" policies.
