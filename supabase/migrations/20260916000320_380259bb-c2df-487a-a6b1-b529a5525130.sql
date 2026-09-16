ALTER TABLE public.weddings
ADD COLUMN total_guests integer NOT NULL DEFAULT 0 CHECK (total_guests >= 0);