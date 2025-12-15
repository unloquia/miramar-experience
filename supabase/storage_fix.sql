-- ============================================
-- STORAGE FIX v2 (SAFE MODE)
-- ============================================

-- 1. Create bucket (SAFE)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ads-images', 'ads-images', true)
ON CONFLICT (id) DO NOTHING;

-- NOTE: We skipped 'ALTER TABLE storage.objects' as it requires superuser permissions
-- and RLS is enabled by default anyway.

-- 2. Policies (SAFE)

-- Public Access
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ads-images' );

-- Authenticated Upload
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'ads-images' );

-- Authenticated Delete
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'ads-images' );

-- Authenticated Update
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'ads-images' );
