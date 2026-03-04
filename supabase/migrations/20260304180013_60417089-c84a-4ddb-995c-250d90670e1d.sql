
-- 1. Create member role enum
CREATE TYPE public.member_role AS ENUM ('owner', 'editor');

-- 2. Create project_members table
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- 3. Create project_invites table
CREATE TABLE public.project_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'editor',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  max_uses INTEGER DEFAULT NULL,
  use_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_invites ENABLE ROW LEVEL SECURITY;

-- 5. Security definer function: check if user is member of a project
CREATE OR REPLACE FUNCTION public.is_project_member(_user_id UUID, _project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE user_id = _user_id AND project_id = _project_id
  )
$$;

-- 6. Security definer function: check if user is owner of a project
CREATE OR REPLACE FUNCTION public.is_project_owner(_user_id UUID, _project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE user_id = _user_id AND project_id = _project_id AND role = 'owner'
  )
$$;

-- 7. RLS for project_members
CREATE POLICY "Members can view their project members"
ON public.project_members FOR SELECT TO authenticated
USING (public.is_project_member(auth.uid(), project_id));

CREATE POLICY "Owners can insert members"
ON public.project_members FOR INSERT TO authenticated
WITH CHECK (public.is_project_owner(auth.uid(), project_id));

CREATE POLICY "Owners can delete members"
ON public.project_members FOR DELETE TO authenticated
USING (public.is_project_owner(auth.uid(), project_id) OR user_id = auth.uid());

-- 8. RLS for project_invites
CREATE POLICY "Members can view project invites"
ON public.project_invites FOR SELECT TO authenticated
USING (public.is_project_member(auth.uid(), project_id));

CREATE POLICY "Owners can create invites"
ON public.project_invites FOR INSERT TO authenticated
WITH CHECK (public.is_project_owner(auth.uid(), project_id));

CREATE POLICY "Owners can delete invites"
ON public.project_invites FOR DELETE TO authenticated
USING (public.is_project_owner(auth.uid(), project_id));

-- Anyone can read an invite by code (for accepting)
CREATE POLICY "Anyone can read invite by code"
ON public.project_invites FOR SELECT TO authenticated
USING (true);

-- 9. Update items RLS: allow members to view shared project items
CREATE POLICY "Members can view shared project items"
ON public.items FOR SELECT TO authenticated
USING (
  project_id IS NOT NULL AND public.is_project_member(auth.uid(), project_id)
);

-- Members can also view the project item itself
CREATE POLICY "Members can view shared projects"
ON public.items FOR SELECT TO authenticated
USING (
  type = 'project' AND public.is_project_member(auth.uid(), id)
);

-- Editors can create items in shared projects
CREATE POLICY "Members can create items in shared projects"
ON public.items FOR INSERT TO authenticated
WITH CHECK (
  project_id IS NOT NULL AND public.is_project_member(auth.uid(), project_id)
);

-- Editors can update items in shared projects
CREATE POLICY "Members can update shared project items"
ON public.items FOR UPDATE TO authenticated
USING (
  project_id IS NOT NULL AND public.is_project_member(auth.uid(), project_id)
);

-- 10. Function to accept an invite
CREATE OR REPLACE FUNCTION public.accept_project_invite(_invite_code TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invite RECORD;
  _project_id UUID;
BEGIN
  -- Find the invite
  SELECT * INTO _invite FROM public.project_invites
  WHERE invite_code = _invite_code
    AND expires_at > now()
    AND (max_uses IS NULL OR use_count < max_uses);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Convite inválido ou expirado';
  END IF;

  _project_id := _invite.project_id;

  -- Insert member (ignore if already exists)
  INSERT INTO public.project_members (project_id, user_id, role)
  VALUES (_project_id, auth.uid(), _invite.role)
  ON CONFLICT (project_id, user_id) DO NOTHING;

  -- Increment use count
  UPDATE public.project_invites SET use_count = use_count + 1
  WHERE id = _invite.id;

  RETURN _project_id;
END;
$$;
