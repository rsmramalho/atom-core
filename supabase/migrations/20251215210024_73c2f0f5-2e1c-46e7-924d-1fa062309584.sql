-- Create project_milestones table
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  weight INTEGER NOT NULL DEFAULT 1,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own milestones"
ON public.project_milestones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones"
ON public.project_milestones FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
ON public.project_milestones FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
ON public.project_milestones FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_project_milestones_updated_at
BEFORE UPDATE ON public.project_milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster queries
CREATE INDEX idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX idx_project_milestones_user_id ON public.project_milestones(user_id);