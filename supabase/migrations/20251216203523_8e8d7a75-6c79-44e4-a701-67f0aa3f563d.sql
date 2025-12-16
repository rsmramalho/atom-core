-- Add completion_log column for tracking recurrent item completions
-- Stores array of ISO date strings (YYYY-MM-DD) for completed instances

ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS completion_log jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.items.completion_log IS 'Array of ISO date strings tracking completed instances of recurrent items';