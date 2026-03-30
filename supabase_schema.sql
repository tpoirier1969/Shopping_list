-- Shared Shopping List schema v1.0.0
-- This version assumes you use Supabase Auth.
-- Simplest shared setup: both devices can sign in with the same account.

create extension if not exists pgcrypto;

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  item_name text not null,
  normalized_name text not null,
  category text not null,
  store text not null check (store in ('ours', 'menards')),
  parent_target text null check (parent_target in ('poirier', 'schaffer')),
  purchased_main boolean not null default false,
  parent_checked boolean not null default false,
  on_shopping_list boolean not null default true,
  delivered boolean not null default false,
  removed boolean not null default false,
  removed_reason text null check (removed_reason in ('manual', 'shopped', 'delivered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shopping_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  item_key text not null,
  category text not null,
  store text not null check (store in ('ours', 'menards')),
  updated_at timestamptz not null default now(),
  unique (user_id, item_key, store)
);

create table if not exists public.shopping_notes (
  user_id uuid primary key default auth.uid(),
  body text not null default '',
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger shopping_items_updated_at
before update on public.shopping_items
for each row execute function public.set_updated_at();

create or replace trigger shopping_rules_updated_at
before update on public.shopping_rules
for each row execute function public.set_updated_at();

create or replace trigger shopping_notes_updated_at
before update on public.shopping_notes
for each row execute function public.set_updated_at();

alter table public.shopping_items enable row level security;
alter table public.shopping_rules enable row level security;
alter table public.shopping_notes enable row level security;

create policy "shopping_items_select_own"
on public.shopping_items
for select
using (auth.uid() = user_id);

create policy "shopping_items_insert_own"
on public.shopping_items
for insert
with check (auth.uid() = user_id);

create policy "shopping_items_update_own"
on public.shopping_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "shopping_items_delete_own"
on public.shopping_items
for delete
using (auth.uid() = user_id);

create policy "shopping_rules_select_own"
on public.shopping_rules
for select
using (auth.uid() = user_id);

create policy "shopping_rules_insert_own"
on public.shopping_rules
for insert
with check (auth.uid() = user_id);

create policy "shopping_rules_update_own"
on public.shopping_rules
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "shopping_rules_delete_own"
on public.shopping_rules
for delete
using (auth.uid() = user_id);

create policy "shopping_notes_select_own"
on public.shopping_notes
for select
using (auth.uid() = user_id);

create policy "shopping_notes_insert_own"
on public.shopping_notes
for insert
with check (auth.uid() = user_id);

create policy "shopping_notes_update_own"
on public.shopping_notes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "shopping_notes_delete_own"
on public.shopping_notes
for delete
using (auth.uid() = user_id);
