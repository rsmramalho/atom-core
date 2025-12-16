-- Create onboarding progress table
CREATE TABLE public.onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  has_completed_welcome BOOLEAN NOT NULL DEFAULT false,
  has_completed_tour BOOLEAN NOT NULL DEFAULT false,
  show_checklist BOOLEAN NOT NULL DEFAULT false,
  checklist_progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own onboarding progress"
ON public.onboarding_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding progress"
ON public.onboarding_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding progress"
ON public.onboarding_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_onboarding_progress_updated_at
BEFORE UPDATE ON public.onboarding_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();