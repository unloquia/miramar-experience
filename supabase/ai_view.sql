-- Vista optimizada para alimentar Google Sheets / Contexto de Bots de IA
-- Esta vista transforma los datos relacionales en texto plano enriquecido y prioridades numéricas

create or replace view ai_knowledge_base as
select
  id as entity_id,
  business_name as display_name,
  category,
  
  -- Generación de Contexto Rico para el LLM
  -- El bot leerá esto para entender el lugar sin necesitan estructura compleja
  concat(
    business_name, ' es una opción de ', category, ' ubicada en ', coalesce(address, 'Miramar'), '. ',
    coalesce(description, ''), '. ',
    coalesce(long_description, '')
  ) as ai_context,

  -- Lógica de Negocio: Peso de Recomendación (CRITICO para el Bot)
  -- El Prompt del bot debe decir: "Prioriza resultados con mayor promotional_weight"
  case
    when tier = 'hero' then 100
    when tier = 'featured' then 50
    when tier = 'standard' then 10
    else 1
  end as promotional_weight,

  -- Flags para el Bot
  case
    when tier in ('hero', 'featured') then 'VERIFICADO,PREMIUM,DESTACADO'
    else 'VERIFICADO'
  end as tags,

  -- Link final para el usuario (WhatsApp o Web)
  -- Si el bot detecta intencion de compra, entrega este link
  coalesce(redirect_url, concat('https://miramar-experience.com/place/', id)) as action_url,

  -- Datos geograficos
  address as location_text,
  concat(lat, ',', lng) as coordinates,

  -- Estado
  expiration_date,
  created_at as updated_at

from ads
where 
  is_active = true 
  and expiration_date > now();

-- Permisos (Solo lectura para admins o service roles)
alter view ai_knowledge_base owner to postgres;
grant select on ai_knowledge_base to service_role;
grant select on ai_knowledge_base to authenticated;
