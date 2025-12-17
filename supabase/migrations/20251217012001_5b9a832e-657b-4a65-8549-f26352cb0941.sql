-- Add DELETE policy for onboarding_progress table
CREATE POLICY "Users can delete their own onboarding progress"
ON public.onboarding_progress
FOR DELETE
USING (auth.uid() = user_id);