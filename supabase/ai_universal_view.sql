-- 1. Tabla de Configuraciones del Sistema (System Settings)
-- Permite al admin guardar el Sheet ID y otras configs globales
create table if not exists system_settings (
  key text primary key,
  value text,
  description text,
  updated_at timestamptz default now()
);

-- Habilitar RLS
alter table system_settings enable row level security;

-- Politica: Solo admins pueden ver y editar
drop policy if exists "Admins can manage settings" on system_settings;
create policy "Admins can manage settings" on system_settings
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Insertar configuración inicial (placeholder)
insert into system_settings (key, value, description)
values ('google_sheet_id', '', 'ID de la Hoja de Cálculo de Google para sincronización con Bot')
on conflict (key) do nothing;


-- 2. Vista "Super Tabla" Universal para IA (Versión 2.0)
drop view if exists ai_knowledge_base;

create or replace view ai_knowledge_base as
select
  id as entity_id,
  
  -- DOMAIN (Macro Categoría)
  case 
    when category in ('gastronomia', 'nocturna') then 'GASTRONOMY'
    when category in ('hoteleria') then 'ACCOMMODATION'
    when category in ('alquileres', 'inmobiliaria', 'propiedades') then 'REAL_ESTATE'
    when category in ('shopping') then 'RETAIL'
    when category in ('aventura') then 'EXPERIENCE'
    else 'SERVICE'
  end as domain,

  -- SUB_TYPE (Categoría específica)
  category as sub_type,

  -- PRICE_LEVEL (Estimado basado en Tier por ahora, idealmente seria un campo propio)
  case
    when tier = 'hero' then '$$$'
    when tier = 'featured' then '$$'
    else '$'
  end as price_level,

  -- KEYWORDS / TAGS (Para filtrado rápido)
  -- Concatenamos nombre y categoría para crear tags básicos
  concat_ws(',', category, tier, lower(business_name)) as features_tags,

  -- METADATA_JSON (Estructura flexible para el futuro)
  -- Por ahora construimos un JSON básico, pero esto está listo para crecer
  json_build_object(
    'tier', tier,
    'priority', priority,
    'has_whatsapp', (redirect_url ilike '%wa.me%'),
    'has_location', (lat is not null)
  ) as metadata_json,

  -- AI_CONTEXT (Redacción natural)
  concat(
    business_name, ' (', category, '). ',
    coalesce(description, ''), '. ',
    'Ubicado en ', coalesce(address, 'Miramar'), '. ',
    coalesce(long_description, '')
  ) as ai_context,

  -- WEIGHT (Peso Comercial)
  case
    when tier = 'hero' then 100
    when tier = 'featured' then 50
    else 10
  end as weight,

  -- ACTION_URL
  coalesce(redirect_url, concat('https://miramar-experience.com/place/', id)) as action_url,

  -- Coordenadas
  concat(lat, ',', lng) as coordinates,
  
  -- Timestamp
  created_at as last_updated

from ads
where 
  is_active = true 
  and expiration_date > now();

-- Permisos
grant select on ai_knowledge_base to service_role;
grant select on ai_knowledge_base to authenticated;
