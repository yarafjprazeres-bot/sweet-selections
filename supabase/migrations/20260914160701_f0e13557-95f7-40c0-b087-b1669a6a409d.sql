CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.weddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  couple_names text NOT NULL DEFAULT 'Carla & Nando',
  wedding_at timestamptz NOT NULL DEFAULT '2026-11-15T19:30:00Z',
  date_text text NOT NULL DEFAULT '15 de Novembro de 2026',
  cover_photo text NOT NULL DEFAULT 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1800&auto=format&fit=crop',
  story text NOT NULL DEFAULT 'Conte aqui como vocês se conheceram, o pedido de casamento e o que esse dia significa para vocês.',
  whatsapp text NOT NULL DEFAULT '',
  theme jsonb NOT NULL DEFAULT '{"primary":"rose","font":"classic","icons":"minimal"}'::jsonb,
  ceremony jsonb NOT NULL DEFAULT '{"local":"Igreja Nossa Senhora","data":"15/11/2026","hora":"16:30","endereco":"Rua das Flores, 100 - Centro, Belo Horizonte","fotos":[]}'::jsonb,
  reception jsonb NOT NULL DEFAULT '{"local":"Espaço Jardim das Acácias","data":"15/11/2026","hora":"19:00","endereco":"Av. dos Ipês, 500 - Jardim, Belo Horizonte","fotos":[]}'::jsonb,
  pix jsonb NOT NULL DEFAULT '{"key":"","name":"","city":""}'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weddings TO authenticated;
GRANT SELECT ON public.weddings TO anon;
GRANT ALL ON public.weddings TO service_role;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their wedding" ON public.weddings FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Published weddings are public" ON public.weddings FOR SELECT TO anon USING (is_published = true);
CREATE TRIGGER weddings_updated_at BEFORE UPDATE ON public.weddings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX weddings_owner_idx ON public.weddings(owner_id);

CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  name text NOT NULL,
  normalized_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wedding_id, normalized_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their guests" ON public.guests FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE INDEX guests_wedding_idx ON public.guests(wedding_id);

CREATE TABLE public.gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  name text NOT NULL,
  price numeric(12,2) NOT NULL CHECK (price > 0),
  image_url text,
  is_given boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gifts TO authenticated;
GRANT SELECT ON public.gifts TO anon;
GRANT ALL ON public.gifts TO service_role;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their gifts" ON public.gifts FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Published wedding gifts are public" ON public.gifts FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = wedding_id AND w.is_published = true));
CREATE TRIGGER gifts_updated_at BEFORE UPDATE ON public.gifts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX gifts_wedding_idx ON public.gifts(wedding_id);

CREATE TABLE public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  attending boolean NOT NULL,
  guest_count integer NOT NULL DEFAULT 0 CHECK (guest_count BETWEEN 0 AND 20),
  guest_names text[] NOT NULL DEFAULT '{}',
  children_count integer NOT NULL DEFAULT 0 CHECK (children_count BETWEEN 0 AND 20),
  child_names text[] NOT NULL DEFAULT '{}',
  helpers_count integer NOT NULL DEFAULT 0 CHECK (helpers_count BETWEEN 0 AND 20),
  helper_names text[] NOT NULL DEFAULT '{}',
  whatsapp text NOT NULL DEFAULT '',
  on_list boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO authenticated;
GRANT INSERT ON public.rsvps TO anon;
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their RSVPs" ON public.rsvps FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Visitors submit RSVPs" ON public.rsvps FOR INSERT TO anon WITH CHECK (EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = wedding_id AND w.owner_id = owner_id AND w.is_published = true));
CREATE TRIGGER rsvps_updated_at BEFORE UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX rsvps_wedding_idx ON public.rsvps(wedding_id);

CREATE OR REPLACE FUNCTION public.check_guest_name(target_wedding uuid, candidate text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.guests g
    JOIN public.weddings w ON w.id = g.wedding_id
    WHERE g.wedding_id = target_wedding
      AND w.is_published = true
      AND g.normalized_name = lower(trim(candidate))
  );
$$;
GRANT EXECUTE ON FUNCTION public.check_guest_name(uuid, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_rsvp_on_list()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.on_list := public.check_guest_name(NEW.wedding_id, NEW.name);
  RETURN NEW;
END;
$$;
CREATE TRIGGER rsvp_check_guest BEFORE INSERT OR UPDATE OF name ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.set_rsvp_on_list();