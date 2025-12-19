-- Vista AI Knowledge Base - V3 (Clean & Humanized)
-- Mejoras: Uso de concat_ws para evitar puntuación doble (..), limpieza de coordenadas nulas, y capitalización.

drop view if exists ai_knowledge_base;
create or replace view ai_knowledge_base as
select
  id as entity_id,
  business_name as display_name,
  category,
  
  -- Generación de Contexto Rico (Narrativa para LLM)
  -- concat_ws('. ', ...) une los fragmentos NO nulos usando punto y espacio como separador.
  concat_ws(' ',
    -- Introducción
    concat(business_name, ' es una opción de ', initcap(category), 
      case when tier = 'hero' then ' (Destacado⭐)' else '' end, '.'
    ),

    -- Ubicación
    concat('Ubicación: ', coalesce(address, 'Miramar'), '.'),
    
    -- Precios (Solo si existe)
    case 
        when price_range = 'cheap' then 'Rango de precios: Económico ($).'
        when price_range = 'moderate' then 'Rango de precios: Moderado ($$).'
        when price_range = 'expensive' then 'Rango de precios: Alto ($$$).'
        when price_range = 'luxury' then 'Rango de precios: Lujo ($$$$).'
        else null
    end,

    -- Descripciones (Evita vacíos)
    case when length(description) > 1 then concat(trim(description), '.') else null end,
    case when length(long_description) > 1 then concat(trim(long_description), '.') else null end,

    -- Amenities
    case 
        when array_length(features, 1) > 0 then concat('Servicios: ', array_to_string(features, ', '), '.')
        else null
    end,

    -- Contacto
    case when phone is not null and length(phone) > 5 then concat('Contacto: ', phone, '.') else null end,
    case when instagram_username is not null then concat('Instagram: @', instagram_username, '.') else null end,
    case when website_url is not null then concat('Web: ', website_url, '.') else null end

  ) as ai_context,

  -- Metadata Estructurada (JSONB limpio)
  jsonb_build_object(
      'category', category,
      'tier', tier,
      'price_range', price_range,
      'amenities', coalesce(features, array[]::text[]),
      'has_phone', (phone is not null),
      'has_instagram', (instagram_username is not null)
  ) as metadata,

  -- Pesos y Tags
  case
    when tier = 'hero' then 100
    when tier = 'featured' then 50
    when tier = 'standard' then 10
    else 1
  end as promotional_weight,

  case
    when tier in ('hero', 'featured') then 'VERIFICADO,PREMIUM,DESTACADO'
    else 'VERIFICADO'
  end as tags,

  -- Link de Acción
  coalesce(redirect_url, concat('https://miramar-experience.com/place/', id)) as action_url,

  -- Geografía Limpia (Null si no hay datos)
  address as location_text,
  case 
    when lat is not null and lng is not null then concat(lat, ',', lng)
    else null 
  end as coordinates,

  -- Control
  expiration_date,
  created_at as updated_at

from ads
where 
  is_active = true 
  and expiration_date > now();

-- Permisos
alter view ai_knowledge_base owner to postgres;
grant select on ai_knowledge_base to service_role;
grant select on ai_knowledge_base to authenticated;
grant select on ai_knowledge_base to anon;
