-- ============================================
-- STORAGE FIX: Create bucket and policies
-- ============================================

-- 1. Create the bucket 'ads-images' if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('ads-images', 'ads-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (seguridad para archivos)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Read Access (Cualquiera puede ver las imágenes)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ads-images' );

-- 4. Policy: Authenticated Upload Access (Solo admin logueado puede subir)
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'ads-images' );

-- 5. Policy: Authenticated Update/Delete (Solo admin puede borrar/editar)
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'ads-images' );

DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'ads-images' );
