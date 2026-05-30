
-- Roles enum + table (separate from profiles to prevent privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Security definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Cases
CREATE TYPE public.case_status AS ENUM ('active', 'found', 'closed', 'pending_review');

CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INT,
  gender TEXT,
  height_cm INT,
  weight_kg INT,
  hair TEXT,
  eye_color TEXT,
  skin_tone TEXT,
  body_shape TEXT,
  tattoos TEXT,
  scars TEXT,
  birthmarks TEXT,
  clothes_last_worn TEXT,
  other_marks TEXT,
  date_missing DATE,
  time_missing TIME,
  last_seen_location TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  description TEXT,
  contact_phone TEXT,
  contact_alt_phone TEXT,
  contact_email TEXT,
  reward NUMERIC DEFAULT 0,
  preferred_channels TEXT[] DEFAULT '{}',
  fir_verified BOOLEAN DEFAULT FALSE,
  ai_status TEXT DEFAULT 'No match yet',
  status case_status NOT NULL DEFAULT 'active',
  cover_photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cases TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cases TO authenticated;
GRANT ALL ON public.cases TO service_role;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cases_public_read" ON public.cases FOR SELECT TO anon, authenticated USING (status IN ('active','found'));
CREATE POLICY "cases_owner_read_all" ON public.cases FOR SELECT TO authenticated USING (auth.uid() = reporter_id);
CREATE POLICY "cases_admin_read_all" ON public.cases FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "cases_insert_own" ON public.cases FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "cases_update_own" ON public.cases FOR UPDATE TO authenticated USING (auth.uid() = reporter_id);
CREATE POLICY "cases_admin_update" ON public.cases FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "cases_delete_own" ON public.cases FOR DELETE TO authenticated USING (auth.uid() = reporter_id);

CREATE INDEX cases_city_idx ON public.cases(city);
CREATE INDEX cases_status_idx ON public.cases(status);
CREATE INDEX cases_created_idx ON public.cases(created_at DESC);

-- Case photos
CREATE TABLE public.case_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.case_photos TO anon, authenticated;
GRANT INSERT, DELETE ON public.case_photos TO authenticated;
GRANT ALL ON public.case_photos TO service_role;
ALTER TABLE public.case_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "case_photos_public_read" ON public.case_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "case_photos_insert_owner" ON public.case_photos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.reporter_id = auth.uid()));
CREATE POLICY "case_photos_delete_owner" ON public.case_photos FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.reporter_id = auth.uid()));

-- Sightings
CREATE TYPE public.sighting_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE public.sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT,
  notes TEXT,
  photo_url TEXT,
  storage_path TEXT,
  ai_confidence NUMERIC,
  ai_result TEXT,
  status sighting_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.sightings TO authenticated;
GRANT UPDATE ON public.sightings TO authenticated;
GRANT ALL ON public.sightings TO service_role;
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sightings_reporter_read" ON public.sightings FOR SELECT TO authenticated USING (auth.uid() = reporter_id);
CREATE POLICY "sightings_case_owner_read" ON public.sightings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.reporter_id = auth.uid()));
CREATE POLICY "sightings_admin_read" ON public.sightings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "sightings_insert_self" ON public.sightings FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "sightings_admin_update" ON public.sightings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  kind TEXT DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own_read" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notifications_own_update" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for case photos (public read)
INSERT INTO storage.buckets (id, name, public) VALUES ('case-photos', 'case-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "case_photos_storage_public_read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'case-photos');
CREATE POLICY "case_photos_storage_authenticated_upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'case-photos');
CREATE POLICY "case_photos_storage_authenticated_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'case-photos' AND owner = auth.uid());
