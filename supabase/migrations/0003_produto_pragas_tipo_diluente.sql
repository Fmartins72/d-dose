-- Nem todo produto usa água como diluente (ex: aplicação FOG usa óleo mineral).
alter table public.produto_pragas
  add column if not exists tipo_diluente text not null default 'Água';
