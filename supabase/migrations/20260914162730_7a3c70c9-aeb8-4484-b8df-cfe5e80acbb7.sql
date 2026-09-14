ALTER TABLE public.weddings
  ADD COLUMN partner_one_name text NOT NULL DEFAULT '',
  ADD COLUMN partner_one_role text NOT NULL DEFAULT 'noiva' CHECK (partner_one_role IN ('noiva', 'noivo')),
  ADD COLUMN partner_two_name text NOT NULL DEFAULT '',
  ADD COLUMN partner_two_role text NOT NULL DEFAULT 'noivo' CHECK (partner_two_role IN ('noiva', 'noivo')),
  ADD COLUMN setup_completed boolean NOT NULL DEFAULT false;

CREATE POLICY "Owners upload wedding photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'wedding-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners view wedding photos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'wedding-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners update wedding photos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'wedding-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'wedding-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Owners delete wedding photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'wedding-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Published wedding photos are visible"
ON storage.objects FOR SELECT TO anon
USING (
  bucket_id = 'wedding-photos'
  AND EXISTS (
    SELECT 1 FROM public.weddings w
    WHERE w.owner_id::text = (storage.foldername(name))[1]
      AND w.is_published = true
  )
);