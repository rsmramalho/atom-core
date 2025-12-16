-- 1. Add weight column to items table
ALTER TABLE public.items ADD COLUMN weight integer DEFAULT 1;

-- 2. Migrate data from project_milestones to items
INSERT INTO public.items (
  user_id,
  title,
  type,
  tags,
  project_id,
  due_date,
  completed,
  completed_at,
  weight,
  created_at,
  updated_at
)
SELECT 
  user_id,
  title,
  'task'::item_type,
  ARRAY['#milestone'],
  project_id,
  due_date,
  completed,
  completed_at,
  weight,
  created_at,
  updated_at
FROM public.project_milestones;

-- 3. Drop the project_milestones table
DROP TABLE public.project_milestones;