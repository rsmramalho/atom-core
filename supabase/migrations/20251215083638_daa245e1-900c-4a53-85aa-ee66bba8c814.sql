-- Atom Engine 4.0 - Core Database Schema

-- Item Types Enum
CREATE TYPE item_type AS ENUM (
  'project',
  'task',
  'habit',
  'note',
  'reflection',
  'resource',
  'list'
);

-- Ritual Slot Enum
CREATE TYPE ritual_slot AS ENUM (
  'manha',
  'meio_dia',
  'noite'
);

-- Project Status Enum
CREATE TYPE project_status AS ENUM (
  'draft',
  'active',
  'paused',
  'completed',
  'archived'
);

-- Progress Mode Enum
CREATE TYPE progress_mode AS ENUM (
  'auto',
  'manual'
);

-- Main Items Table (Single Table Design)
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type item_type NOT NULL DEFAULT 'task',
  
  -- Context and Classification
  module TEXT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Hierarchy
  parent_id UUID NULL REFERENCES public.items(id) ON DELETE SET NULL,
  project_id UUID NULL REFERENCES public.items(id) ON DELETE SET NULL,
  
  -- Time and Rhythm
  due_date DATE NULL,
  recurrence_rule TEXT NULL,
  ritual_slot ritual_slot NULL,
  
  -- State
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ NULL,
  
  -- Content
  notes TEXT NULL,
  checklist JSONB DEFAULT '[]',
  
  -- Project Meta (only used when type = 'project')
  project_status project_status NULL,
  progress_mode progress_mode NULL DEFAULT 'auto',
  progress INTEGER NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE NULL,
  milestones JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_type ON public.items(type);
CREATE INDEX idx_items_project_id ON public.items(project_id);
CREATE INDEX idx_items_parent_id ON public.items(parent_id);
CREATE INDEX idx_items_due_date ON public.items(due_date);
CREATE INDEX idx_items_completed ON public.items(completed);
CREATE INDEX idx_items_tags ON public.items USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own items
CREATE POLICY "Users can view their own items"
ON public.items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own items"
ON public.items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
ON public.items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
ON public.items
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Realtime for items table
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;