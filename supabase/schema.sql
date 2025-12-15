-- ============================================
-- MIRAMAR EXPERIENCE - DATABASE SCHEMA v2.0
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Step 1: Create ENUM types (if not exist)
DO $$ BEGIN
    CREATE TYPE ad_tier AS ENUM ('hero', 'featured', 'standard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ad_category AS ENUM ('gastronomia', 'hoteleria', 'shopping', 'aventura', 'nocturna');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create the ads table (or update if exists)
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Business Info
  business_name TEXT NOT NULL,
  description TEXT, -- Max 140 chars (short for cards)
  long_description TEXT, -- Extended description for detail page
  
  -- Media
  image_url TEXT NOT NULL,
  gallery_urls TEXT[] DEFAULT '{}', -- Array of additional image URLs
  
  -- Contact & Links
  redirect_url TEXT, -- WhatsApp or web URL
  
  -- Classification
  tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('hero', 'featured', 'standard')),
  category TEXT NOT NULL CHECK (category IN ('gastronomia', 'hoteleria', 'shopping', 'aventura', 'nocturna')),
  priority INT DEFAULT 0, -- For ordering (higher = first)
  
  -- Geolocation
  lat FLOAT, -- Latitude
  lng FLOAT, -- Longitude
  address TEXT, -- Human-readable address
  show_on_map BOOLEAN DEFAULT true, -- Whether to display on map
  
  -- Timing & Status
  expiration_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_permanent BOOLEAN DEFAULT false -- If true, never expires (for base map places)
);

-- Step 3: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_ads_active_tier ON public.ads (is_active, tier, expiration_date);
CREATE INDEX IF NOT EXISTS idx_ads_location ON public.ads (lat, lng) WHERE lat IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ads_category ON public.ads (category);

-- Step 4: Enable Row Level Security
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
-- Drop existing policies first
DROP POLICY IF EXISTS "Public view active ads" ON public.ads;
DROP POLICY IF EXISTS "Public read active ads" ON public.ads;
DROP POLICY IF EXISTS "Admin manage ads" ON public.ads;
DROP POLICY IF EXISTS "Auth users full access" ON public.ads;

-- Policy: Public can view active, non-expired ads OR permanent places
CREATE POLICY "Public view active ads" ON public.ads
FOR SELECT USING (
  (is_active = true AND expiration_date > now()) 
  OR (is_active = true AND is_permanent = true)
);

-- Policy: Authenticated users can manage all ads
CREATE POLICY "Admin manage ads" ON public.ads
FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- MIGRATION: Add new columns to existing table
-- Run this if table already exists
-- ============================================
-- ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS lat FLOAT;
-- ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS lng FLOAT;
-- ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS address TEXT;
-- ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS long_description TEXT;
-- ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
-- ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS show_on_map BOOLEAN DEFAULT true;
-- ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS is_permanent BOOLEAN DEFAULT false;

-- ============================================
-- STORAGE BUCKET SETUP
-- Run these in Supabase Dashboard > Storage
-- ============================================
-- 1. Create bucket named: ads-images
-- 2. Set bucket to PUBLIC
-- 3. Add policy for authenticated uploads

-- ============================================
-- SAMPLE DATA WITH GEOLOCATION
-- ============================================
-- INSERT INTO public.ads (business_name, description, long_description, image_url, tier, category, expiration_date, lat, lng, address) 
-- VALUES 
--   ('Grand Hotel Miramar', 'Experimenta el lujo frente al mar.', 'El Grand Hotel Miramar ofrece una experiencia única con vistas panorámicas al océano, spa de primer nivel, piscina infinita y gastronomía de autor. Ubicado en el corazón de la costanera, a pasos de la playa principal.', 'https://example.com/hotel.jpg', 'hero', 'hoteleria', now() + interval '1 year', -38.2731, -57.8367, 'Av. Costanera 1234'),
--   ('El Muelle Restó', 'Sabores de mar con la mejor vista.', 'Restaurante especializado en mariscos frescos y cocina de autor. Terraza con vista al mar, carta de vinos premium y atención personalizada.', 'https://example.com/resto.jpg', 'featured', 'gastronomia', now() + interval '6 months', -38.2698, -57.8401, 'Muelle de Pescadores s/n');

