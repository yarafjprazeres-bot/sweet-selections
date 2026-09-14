ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS total_guests integer NOT NULL DEFAULT 0;
