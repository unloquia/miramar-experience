-- Tabla de eventos analíticos
create table if not exists analytics_events (
  id uuid default gen_random_uuid() primary key,
  ad_id uuid references ads(id) on delete cascade,
  event_type text not null, -- 'view_detail', 'click_whatsapp', 'click_website', 'click_map'
  created_at timestamptz default now(),
  meta jsonb default '{}'::jsonb -- Para guardar datos extra si hiciera falta
);

-- Indices para reportes rápidos
create index if not exists idx_analytics_ad_id on analytics_events(ad_id);
create index if not exists idx_analytics_created_at on analytics_events(created_at);
create index if not exists idx_analytics_event_type on analytics_events(event_type);

-- Política RLS: Solo insertar anonimamente (public) y leer solo admin
alter table analytics_events enable row level security;

-- Permitir insertar a cualquiera (anon) para trackear
drop policy if exists "Enable insert for anon" on analytics_events;
create policy "Enable insert for anon" on analytics_events for insert
with check (true);

-- Permitir lectura solo a autenticados (admin)
drop policy if exists "Enable read for authenticated" on analytics_events;
create policy "Enable read for authenticated" on analytics_events for select
using (auth.role() = 'authenticated');
