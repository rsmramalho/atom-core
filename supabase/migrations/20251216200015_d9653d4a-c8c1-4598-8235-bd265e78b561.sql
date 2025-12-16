-- Create onboarding analytics table
CREATE TABLE public.onboarding_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_analytics ENABLE ROW LEVEL SECURITY;

-- Users can insert their own analytics
CREATE POLICY "Users can insert own analytics"
ON public.onboarding_analytics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own analytics
CREATE POLICY "Users can view own analytics"
ON public.onboarding_analytics
FOR SELECT
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_onboarding_analytics_user_id ON public.onboarding_analytics(user_id);
CREATE INDEX idx_onboarding_analytics_event_type ON public.onboarding_analytics(event_type);
CREATE INDEX idx_onboarding_analytics_created_at ON public.onboarding_analytics(created_at);