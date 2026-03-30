-- Shared Shopping List schema v1.3.0
-- Shared mode: automatic anonymous sign-in, no email/password form.
-- Important: in Supabase, enable Anonymous sign-ins under Authentication > Providers.

create extension if not exists pgcrypto;

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  item_name text not null,
  normalized_name text not null,
  category text not null,
  store text not null,
  parent_target text null,
  purchased_main boolean not null default false,
  parent_checked boolean not null default false,
  on_shopping_list boolean not null default true,
  delivered boolean not null default false,
  removed boolean not null default false,
  removed_reason text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shopping_rules (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  item_key text not null,
  category text not null,
  store text not null,
  updated_at timestamptz not null default now(),
  unique (household_id, item_key, store)
);

create table if not exists public.shopping_notes (
  household_id text primary key,
  body text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.shopping_stores (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  store_key text not null,
  store_label text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, store_key)
);

create table if not exists public.shopping_note_items (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  lane text not null default 'shared',
  body text not null,
  is_checked boolean not null default false,
  sort_order bigint not null default extract(epoch from now())::bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shopping_items add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shopping_rules add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shopping_notes add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shopping_stores add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shopping_stores add column if not exists store_key text;
alter table public.shopping_stores add column if not exists store_label text;
alter table public.shopping_stores add column if not exists sort_order integer not null default 100;
alter table public.shopping_stores add column if not exists created_at timestamptz not null default now();
alter table public.shopping_stores add column if not exists updated_at timestamptz not null default now();
alter table public.shopping_note_items add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shopping_note_items add column if not exists lane text not null default 'shared';
alter table public.shopping_note_items add column if not exists body text not null default '';
alter table public.shopping_note_items add column if not exists is_checked boolean not null default false;
alter table public.shopping_note_items add column if not exists sort_order bigint not null default extract(epoch from now())::bigint;
alter table public.shopping_note_items add column if not exists created_at timestamptz not null default now();
alter table public.shopping_note_items add column if not exists updated_at timestamptz not null default now();

update public.shopping_items
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shopping_rules
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shopping_notes
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shopping_stores
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shopping_note_items
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shopping_items set store = 'shopping' where store = 'ours';
update public.shopping_rules set store = 'shopping' where store = 'ours';
update public.shopping_items set parent_target = 'schaffer' where parent_target = 'shafer';
update public.shopping_note_items set lane = 'shared' where lane not in ('shared', 'donna', 'tod') or lane is null;

alter table public.shopping_items drop constraint if exists shopping_items_store_check;
alter table public.shopping_items drop constraint if exists shopping_items_parent_target_check;
alter table public.shopping_items drop constraint if exists shopping_items_removed_reason_check;
alter table public.shopping_rules drop constraint if exists shopping_rules_store_check;
alter table public.shopping_note_items drop constraint if exists shopping_note_items_lane_check;

alter table public.shopping_items
  add constraint shopping_items_parent_target_check
  check (parent_target in ('poirier', 'schaffer') or parent_target is null);

alter table public.shopping_items
  add constraint shopping_items_removed_reason_check
  check (removed_reason in ('manual', 'shopped', 'delivered') or removed_reason is null);

alter table public.shopping_note_items
  add constraint shopping_note_items_lane_check
  check (lane in ('shared', 'donna', 'tod'));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shopping_items_updated_at on public.shopping_items;
create trigger shopping_items_updated_at
before update on public.shopping_items
for each row execute function public.set_updated_at();

drop trigger if exists shopping_rules_updated_at on public.shopping_rules;
create trigger shopping_rules_updated_at
before update on public.shopping_rules
for each row execute function public.set_updated_at();

drop trigger if exists shopping_notes_updated_at on public.shopping_notes;
create trigger shopping_notes_updated_at
before update on public.shopping_notes
for each row execute function public.set_updated_at();

drop trigger if exists shopping_stores_updated_at on public.shopping_stores;
create trigger shopping_stores_updated_at
before update on public.shopping_stores
for each row execute function public.set_updated_at();

drop trigger if exists shopping_note_items_updated_at on public.shopping_note_items;
create trigger shopping_note_items_updated_at
before update on public.shopping_note_items
for each row execute function public.set_updated_at();

alter table public.shopping_items enable row level security;
alter table public.shopping_rules enable row level security;
alter table public.shopping_notes enable row level security;
alter table public.shopping_stores enable row level security;
alter table public.shopping_note_items enable row level security;

drop policy if exists "shopping_items_shared_authenticated" on public.shopping_items;
drop policy if exists "shopping_rules_shared_authenticated" on public.shopping_rules;
drop policy if exists "shopping_notes_shared_authenticated" on public.shopping_notes;
drop policy if exists "shopping_stores_shared_authenticated" on public.shopping_stores;
drop policy if exists "shopping_note_items_shared_authenticated" on public.shopping_note_items;

create policy "shopping_items_shared_authenticated"
on public.shopping_items
for all
to authenticated
using (true)
with check (true);

create policy "shopping_rules_shared_authenticated"
on public.shopping_rules
for all
to authenticated
using (true)
with check (true);

create policy "shopping_notes_shared_authenticated"
on public.shopping_notes
for all
to authenticated
using (true)
with check (true);

create policy "shopping_stores_shared_authenticated"
on public.shopping_stores
for all
to authenticated
using (true)
with check (true);

create policy "shopping_note_items_shared_authenticated"
on public.shopping_note_items
for all
to authenticated
using (true)
with check (true);

create unique index if not exists shopping_rules_household_item_store_idx
on public.shopping_rules (household_id, item_key, store);

create unique index if not exists shopping_notes_household_id_idx
on public.shopping_notes (household_id);

create unique index if not exists shopping_stores_household_store_key_idx
on public.shopping_stores (household_id, store_key);

create index if not exists shopping_note_items_household_lane_idx
on public.shopping_note_items (household_id, lane, sort_order, created_at);

insert into public.shopping_stores (household_id, store_key, store_label, sort_order)
values
  ('tod-donna-shared', 'shopping', 'Groceries', 10),
  ('tod-donna-shared', 'menards', 'Menards', 20)
on conflict (household_id, store_key)
do update set
  store_label = excluded.store_label,
  sort_order = excluded.sort_order,
  updated_at = now();
