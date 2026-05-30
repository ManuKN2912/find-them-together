
-- handle_new_user should only be called by trigger, not by API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Drop overly-broad bucket SELECT and re-add as object-level read only
DROP POLICY IF EXISTS "case_photos_storage_public_read" ON storage.objects;
CREATE POLICY "case_photos_storage_object_read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'case-photos' AND name IS NOT NULL);
