-- Pragas/insetos, organizados por classe.
create table if not exists public.pragas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  classe text not null check (classe in ('Insetos Rasteiros', 'Insetos Voadores', 'Demais Pragas', 'Grãos Armazenados')),
  created_at timestamptz not null default now()
);

-- Produtos líquidos de desinsetização.
create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ingrediente_ativo text,
  created_at timestamptz not null default now()
);

-- Diluição de cada produto para cada praga (dados extraídos da bula).
create table if not exists public.produto_pragas (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references public.produtos(id) on delete cascade,
  praga_id uuid not null references public.pragas(id) on delete cascade,
  metodo_aplicacao text,
  dose_produto numeric not null check (dose_produto > 0),
  unidade_dose text not null default 'mL' check (unidade_dose in ('mL', 'L')),
  volume_diluente_l numeric not null check (volume_diluente_l > 0),
  area_m2 numeric not null check (area_m2 > 0),
  created_at timestamptz not null default now(),
  unique (produto_id, praga_id, metodo_aplicacao)
);

alter table public.pragas enable row level security;
alter table public.produtos enable row level security;
alter table public.produto_pragas enable row level security;

create policy "Leitura publica de pragas"
  on public.pragas for select
  to anon, authenticated
  using (true);

create policy "Escrita autenticada de pragas"
  on public.pragas for all
  to authenticated
  using (true)
  with check (true);

create policy "Leitura publica de produtos"
  on public.produtos for select
  to anon, authenticated
  using (true);

create policy "Escrita autenticada de produtos"
  on public.produtos for all
  to authenticated
  using (true)
  with check (true);

create policy "Leitura publica de produto_pragas"
  on public.produto_pragas for select
  to anon, authenticated
  using (true);

create policy "Escrita autenticada de produto_pragas"
  on public.produto_pragas for all
  to authenticated
  using (true)
  with check (true);
