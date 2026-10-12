ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS rsvp_deadline date;
CREATE OR REPLACE FUNCTION public.enforce_rsvp_deadline()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE d date;
BEGIN
  SELECT rsvp_deadline INTO d FROM public.weddings WHERE id = NEW.wedding_id;
  IF d IS NOT NULL AND (now() AT TIME ZONE 'America/Sao_Paulo')::date > d THEN
    RAISE EXCEPTION 'rsvp_closed';
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.enforce_rsvp_deadline() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER rsvp_deadline_check BEFORE INSERT ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.enforce_rsvp_deadline();