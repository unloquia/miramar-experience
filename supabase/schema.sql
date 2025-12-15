-- ============================================
-- MIRAMAR EXPERIENCE - DATABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Step 1: Create ENUM types
CREATE TYPE ad_tier AS ENUM ('hero', 'featured', 'standard');
CREATE TYPE ad_category AS ENUM ('gastronomia', 'hoteleria', 'shopping', 'aventura', 'nocturna');

-- Step 2: Create the ads table
CREATE TABLE public.ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  business_name TEXT NOT NULL,
  description TEXT, -- Max 140 chars (enforced by frontend)
  image_url TEXT NOT NULL,
  redirect_url TEXT, -- WhatsApp or web URL
  tier ad_tier NOT NULL DEFAULT 'standard',
  category ad_category NOT NULL,
  priority INT DEFAULT 0, -- For ordering (higher = first)
  expiration_date TIMESTAMPTZ NOT NULL, -- REQUIRED
  is_active BOOLEAN DEFAULT true
);

-- Step 3: Create performance index (CRITICAL)
CREATE INDEX idx_ads_active_tier ON public.ads (is_active, tier, expiration_date);

-- Step 4: Enable Row Level Security
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
-- Policy: Public can view active, non-expired ads
CREATE POLICY "Public view active ads" ON public.ads
FOR SELECT USING (is_active = true AND expiration_date > now());

-- Policy: Authenticated users can manage all ads
CREATE POLICY "Admin manage ads" ON public.ads
FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKET SETUP
-- Run these in Supabase Dashboard > Storage
-- ============================================
-- 1. Create bucket named: ads-images
-- 2. Set bucket to PUBLIC
-- 3. Add policy for authenticated uploads:
--    - Policy name: "Authenticated users can upload"
--    - Allowed operation: INSERT
--    - Policy: (auth.role() = 'authenticated')

-- ============================================
-- SAMPLE DATA (OPTIONAL)
-- ============================================
-- INSERT INTO public.ads (business_name, description, image_url, tier, category, expiration_date) 
-- VALUES 
--   ('Grand Hotel Miramar', 'Experimenta el lujo frente al mar. Spa y piscina infinita.', 'https://example.com/hotel.jpg', 'hero', 'hoteleria', now() + interval '30 days'),
--   ('El Muelle Restó', 'Sabores de mar con la mejor vista de la ciudad.', 'https://example.com/resto.jpg', 'featured', 'gastronomia', now() + interval '30 days'),
--   ('Boutique Costera', 'Moda y accesorios para tu verano.', 'https://example.com/boutique.jpg', 'standard', 'shopping', now() + interval '30 days');
