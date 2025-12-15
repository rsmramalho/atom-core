-- Add order_index column for drag & drop ordering
ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_items_order_index ON public.items(order_index);