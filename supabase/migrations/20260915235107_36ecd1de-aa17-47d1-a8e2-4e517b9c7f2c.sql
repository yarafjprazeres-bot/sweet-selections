ALTER TABLE public.rsvps
ADD COLUMN message text;

ALTER TABLE public.rsvps
ADD CONSTRAINT rsvps_message_length CHECK (message IS NULL OR char_length(message) <= 600);

CREATE TABLE public.gift_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id uuid NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  sender_name text NOT NULL,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT gift_messages_sender_name_length CHECK (char_length(trim(sender_name)) BETWEEN 2 AND 120),
  CONSTRAINT gift_messages_message_length CHECK (message IS NULL OR char_length(message) <= 600),
  CONSTRAINT gift_messages_one_per_gift UNIQUE (gift_id)
);

GRANT SELECT, INSERT, DELETE ON public.gift_messages TO authenticated;
GRANT INSERT ON public.gift_messages TO anon;
GRANT ALL ON public.gift_messages TO service_role;

ALTER TABLE public.gift_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view their gift messages"
ON public.gift_messages
FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Owners delete their gift messages"
ON public.gift_messages
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Visitors submit gift messages"
ON public.gift_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.gifts g
    JOIN public.weddings w ON w.id = g.wedding_id
    WHERE g.id = gift_messages.gift_id
      AND g.wedding_id = gift_messages.wedding_id
      AND g.owner_id = gift_messages.owner_id
      AND g.is_given = false
      AND w.is_published = true
  )
);

CREATE OR REPLACE FUNCTION public.mark_gift_as_given()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.gifts
  SET is_given = true
  WHERE id = NEW.gift_id
    AND wedding_id = NEW.wedding_id
    AND owner_id = NEW.owner_id;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_gift_as_given() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_gift_as_given() TO service_role;

CREATE TRIGGER gift_message_marks_given
AFTER INSERT ON public.gift_messages
FOR EACH ROW
EXECUTE FUNCTION public.mark_gift_as_given();