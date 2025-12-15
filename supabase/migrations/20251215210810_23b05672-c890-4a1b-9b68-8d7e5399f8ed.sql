-- Update default weight for milestones to 3
ALTER TABLE public.project_milestones ALTER COLUMN weight SET DEFAULT 3;