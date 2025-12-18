-- Phase 2: Data Enrichment Migration
-- Run this in Supabase SQL Editor

-- 1. Contacto Extra
ALTER TABLE public.ads 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS instagram_username text,
ADD COLUMN IF NOT EXISTS website_url text;

-- 2. Información Comercial
-- Price Range: cheap ($), moderate ($$), expensive ($$$), luxury ($$$$)
ALTER TABLE public.ads 
ADD COLUMN IF NOT EXISTS price_range text CHECK (price_range IN ('cheap', 'moderate', 'expensive', 'luxury')),
ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}';

-- 3. Horarios
-- Estructura JSONB esperada:
-- {
--   "monday": { "open": "09:00", "close": "20:00", "closed": false },
--   "tuesday": ...
-- }
ALTER TABLE public.ads 
ADD COLUMN IF NOT EXISTS opening_hours jsonb;

-- Comentarios para documentación
COMMENT ON COLUMN public.ads.phone IS 'Número de teléfono o WhatsApp directo para botón de llamada';
COMMENT ON COLUMN public.ads.instagram_username IS 'Usuario de IG sin @';
COMMENT ON COLUMN public.ads.features IS 'Array de strings: [wifi, pet_friendly, card_payment, ac, outdoor_seating]';
