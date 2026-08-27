-- Tabela de grãos/culturas usada nos cálculos de Expurgo, Volume m³ (silo) e Pilha m³.
create table if not exists public.graos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  densidade_aparente_kg_m3 numeric not null check (densidade_aparente_kg_m3 > 0),
  peso_saca_kg numeric not null check (peso_saca_kg > 0),
  dosagem_fumigante_g_m3 numeric not null default 6 check (dosagem_fumigante_g_m3 > 0),
  created_at timestamptz not null default now()
);

alter table public.graos enable row level security;

-- Catálogo é público: qualquer operador (sem login) pode ler.
create policy "Leitura publica de graos"
  on public.graos for select
  to anon, authenticated
  using (true);

-- Só o admin autenticado (Supabase Auth) pode cadastrar/editar/excluir.
create policy "Escrita autenticada de graos"
  on public.graos for all
  to authenticated
  using (true)
  with check (true);
