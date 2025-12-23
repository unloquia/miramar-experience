-- =============================================
-- SCRIPT DE REINICIO Y CARGA DE DATOS DE EJEMPLO
-- =============================================
-- INSTRUCCIONES:
-- 1. Copia todo este contenido.
-- 2. Ve al SQL Editor de Supabase.
-- 3. Pega y ejecuta.
-- =============================================

-- 1. LIMPIEZA DE DATOS (Mantiene la estructura de tablas)
TRUNCATE TABLE chat_messages CASCADE;
TRUNCATE TABLE ads CASCADE;

-- 2. CARGA DE DATOS SEMILLA (Ejemplos Premium)

-- EJEMPLO 1: HERO (Gastronomía)
INSERT INTO ads (
    business_name,
    description,
    description_long,
    image_url,
    category,
    tier,
    contact_phone,
    contact_email,
    contact_instagram,
    contact_website,
    address,
    lat,
    lng,
    features,
    expiration_date,
    is_active,
    show_on_map,
    priority,
    feature_flags
) VALUES (
    'Pizzería Don Mario',
    'Las mejores pizzas a la piedra frente al mar. Tradición familiar desde 1980.',
    'Pizzería Don Mario es un clásico de Miramar. Ofrecemos más de 40 variedades de pizza a la piedra, empanadas caseras y fainá. Nuestro local cuenta con vista al mar y un ambiente familiar inigualable. Aceptamos reservas para cumpleaños y eventos.',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    'gastronomia',
    'hero', -- Nivel más alto
    '2291123456',
    'contacto@donmario.com',
    'pizzeriadonmario',
    'https://donmario.com',
    'Av. Costanera 1234, Miramar',
    -38.2715, -57.8385,
    ARRAY['wifi', 'outdoor_seating', 'delivery', 'mercadopago'], -- Features
    NOW() + INTERVAL '1 year', -- Vence en 1 año
    true,
    true,
    95, -- Prioridad muy alta
    '{"price_range": "$$"}'::jsonb
);

-- EJEMPLO 2: FEATURED (Hotelería)
INSERT INTO ads (
    business_name,
    description,
    description_long,
    image_url,
    category,
    tier,
    contact_phone,
    contact_email,
    contact_instagram,
    contact_website,
    address,
    lat,
    lng,
    features,
    expiration_date,
    is_active,
    show_on_map,
    priority,
    feature_flags
) VALUES (
    'Gran Hotel Miramar',
    'Confort y descanso a pasos del centro. Spa, piscina climatizada y desayuno buffet.',
    'El Gran Hotel Miramar te espera para tus vacaciones soñadas. Habitaciones con vista al mar, servicio a la habitación las 24hs y acceso exclusivo a nuestro spa. Ideal para parejas y familias que buscan relajarse.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    'hoteleria',
    'featured', -- Nivel medio
    '2291987654',
    'reservas@granhotel.com',
    'granhotelmiramar',
    'https://granhotelmiramar.com',
    'Calle 21 nro 600, Miramar',
    -38.2730, -57.8350,
    ARRAY['wifi', 'parking', 'accessible', 'reservations'],
    NOW() + INTERVAL '6 months',
    true,
    true,
    50, -- Prioridad media
    '{"price_range": "$$$"}'::jsonb
);

-- EJEMPLO 3: FEATURED (Aventura/Surf)
INSERT INTO ads (
    business_name,
    description,
    description_long,
    image_url,
    category,
    tier,
    contact_phone,
    contact_email,
    contact_instagram,
    address,
    lat,
    lng,
    features,
    expiration_date,
    is_active,
    show_on_map,
    priority,
    feature_flags
) VALUES (
    'Miramar Xtreme Surf School',
    'Clases de surf para todas las edades. Alquiler de tablas y trajes.',
    'Aprendé a surfear con los mejores instructores de la costa. Clases grupales e individuales. Incluye todo el equipo necesario y seguro médico. ¡Animate a desafiar las olas!',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop',
    'aventura',
    'featured',
    '2291555555',
    'hola@xtremesurf.com',
    'miramarxtreme',
    'Balneario 9, Playa, Miramar',
    -38.2810, -57.8420,
    ARRAY['mercadopago', 'outdoor_seating', 'cash'],
    NOW() + INTERVAL '90 days',
    true,
    true,
    60,
    '{"price_range": "$$"}'::jsonb
);

-- EJEMPLO 4: STANDARD (Comercio Local / Kiosco)
INSERT INTO ads (
    business_name,
    description,
    description_long,
    image_url,
    category,
    tier,
    address,
    lat,
    lng,
    features,
    expiration_date,
    is_active,
    show_on_map,
    priority,
    feature_flags
) VALUES (
    'Kiosco El Faro',
    'Abierto 24hs. Bebidas, golosinas y carga virtual.',
    'Tu parada obligada de cada noche. Tenemos todo lo que necesitás.',
    'https://images.unsplash.com/photo-1513262607590-cd5cf6c42978?q=80&w=1000&auto=format&fit=crop',
    'shopping',
    'standard', -- Nivel básico
    'Calle 12 y 23, Miramar',
    -38.2700, -57.8300,
    ARRAY['cash'],
    NOW() + INTERVAL '1 year',
    true,
    true,
    10, -- Prioridad baja
    '{"price_range": "$"}'::jsonb
);

-- Finalizar
NOTIFY pgrst, 'reload schema';
