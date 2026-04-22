-- Shared Shopping List schema v1.6.1
-- Isolated table family: shoppinglist_*
-- Shared mode: automatic anonymous sign-in, no email/password form.
-- Important: in Supabase, enable Anonymous sign-ins under Authentication > Providers.

create extension if not exists pgcrypto;

create table if not exists public.shoppinglist_items (
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

create table if not exists public.shoppinglist_rules (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  item_key text not null,
  category text not null,
  store text not null,
  updated_at timestamptz not null default now(),
  unique (household_id, item_key, store)
);

create table if not exists public.shoppinglist_notes (
  household_id text primary key,
  body text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.shoppinglist_stores (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  store_key text not null,
  store_label text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, store_key)
);

create table if not exists public.shoppinglist_note_items (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  lane text not null default 'shared',
  body text not null,
  is_checked boolean not null default false,
  sort_order bigint not null default extract(epoch from now())::bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shoppinglist_items add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shoppinglist_rules add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shoppinglist_notes add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shoppinglist_stores add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shoppinglist_stores add column if not exists store_key text;
alter table public.shoppinglist_stores add column if not exists store_label text;
alter table public.shoppinglist_stores add column if not exists sort_order integer not null default 100;
alter table public.shoppinglist_stores add column if not exists created_at timestamptz not null default now();
alter table public.shoppinglist_stores add column if not exists updated_at timestamptz not null default now();
alter table public.shoppinglist_note_items add column if not exists household_id text not null default 'tod-donna-shared';
alter table public.shoppinglist_note_items add column if not exists lane text not null default 'shared';
alter table public.shoppinglist_note_items add column if not exists body text not null default '';
alter table public.shoppinglist_note_items add column if not exists is_checked boolean not null default false;
alter table public.shoppinglist_note_items add column if not exists sort_order bigint not null default extract(epoch from now())::bigint;
alter table public.shoppinglist_note_items add column if not exists created_at timestamptz not null default now();
alter table public.shoppinglist_note_items add column if not exists updated_at timestamptz not null default now();

update public.shoppinglist_items
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shoppinglist_rules
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shoppinglist_notes
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shoppinglist_stores
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shoppinglist_note_items
set household_id = coalesce(nullif(household_id, ''), 'tod-donna-shared')
where household_id is null or household_id = '';

update public.shoppinglist_items set store = 'shopping' where store = 'ours';
update public.shoppinglist_rules set store = 'shopping' where store = 'ours';
update public.shoppinglist_items set parent_target = 'schaffer' where parent_target = 'shafer';
update public.shoppinglist_note_items
set lane = 'shared'
where lane not in ('shared', 'donna', 'tod', 'trip-clothing', 'trip-tents', 'trip-fishing-gear', 'trip-boat-stuff', 'trip-cooking', 'trip-food', 'trip-toiletries', 'trip-bedding', 'trip-first-aid', 'trip-tools', 'trip-electronics', 'trip-paperwork', 'trip-dog-stuff', 'trip-misc')
   or lane is null;

alter table public.shoppinglist_items drop constraint if exists shoppinglist_items_parent_target_check;
alter table public.shoppinglist_items drop constraint if exists shoppinglist_items_removed_reason_check;
alter table public.shoppinglist_note_items drop constraint if exists shoppinglist_note_items_lane_check;

alter table public.shoppinglist_items
  add constraint shoppinglist_items_parent_target_check
  check (parent_target in ('poirier', 'schaffer') or parent_target is null);

alter table public.shoppinglist_items
  add constraint shoppinglist_items_removed_reason_check
  check (removed_reason in ('manual', 'shopped', 'delivered') or removed_reason is null);

alter table public.shoppinglist_note_items
  add constraint shoppinglist_note_items_lane_check
  check (lane in ('shared', 'donna', 'tod', 'trip-clothing', 'trip-tents', 'trip-fishing-gear', 'trip-boat-stuff', 'trip-cooking', 'trip-food', 'trip-toiletries', 'trip-bedding', 'trip-first-aid', 'trip-tools', 'trip-electronics', 'trip-paperwork', 'trip-dog-stuff', 'trip-misc'));

create or replace function public.shoppinglist_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shoppinglist_items_updated_at on public.shoppinglist_items;
create trigger shoppinglist_items_updated_at
before update on public.shoppinglist_items
for each row execute function public.shoppinglist_set_updated_at();

drop trigger if exists shoppinglist_rules_updated_at on public.shoppinglist_rules;
create trigger shoppinglist_rules_updated_at
before update on public.shoppinglist_rules
for each row execute function public.shoppinglist_set_updated_at();

drop trigger if exists shoppinglist_notes_updated_at on public.shoppinglist_notes;
create trigger shoppinglist_notes_updated_at
before update on public.shoppinglist_notes
for each row execute function public.shoppinglist_set_updated_at();

drop trigger if exists shoppinglist_stores_updated_at on public.shoppinglist_stores;
create trigger shoppinglist_stores_updated_at
before update on public.shoppinglist_stores
for each row execute function public.shoppinglist_set_updated_at();

drop trigger if exists shoppinglist_note_items_updated_at on public.shoppinglist_note_items;
create trigger shoppinglist_note_items_updated_at
before update on public.shoppinglist_note_items
for each row execute function public.shoppinglist_set_updated_at();

alter table public.shoppinglist_items enable row level security;
alter table public.shoppinglist_rules enable row level security;
alter table public.shoppinglist_notes enable row level security;
alter table public.shoppinglist_stores enable row level security;
alter table public.shoppinglist_note_items enable row level security;

drop policy if exists "shoppinglist_items_shared_authenticated" on public.shoppinglist_items;
drop policy if exists "shoppinglist_rules_shared_authenticated" on public.shoppinglist_rules;
drop policy if exists "shoppinglist_notes_shared_authenticated" on public.shoppinglist_notes;
drop policy if exists "shoppinglist_stores_shared_authenticated" on public.shoppinglist_stores;
drop policy if exists "shoppinglist_note_items_shared_authenticated" on public.shoppinglist_note_items;

create policy "shoppinglist_items_shared_authenticated"
on public.shoppinglist_items
for all
to authenticated
using (true)
with check (true);

create policy "shoppinglist_rules_shared_authenticated"
on public.shoppinglist_rules
for all
to authenticated
using (true)
with check (true);

create policy "shoppinglist_notes_shared_authenticated"
on public.shoppinglist_notes
for all
to authenticated
using (true)
with check (true);

create policy "shoppinglist_stores_shared_authenticated"
on public.shoppinglist_stores
for all
to authenticated
using (true)
with check (true);

create policy "shoppinglist_note_items_shared_authenticated"
on public.shoppinglist_note_items
for all
to authenticated
using (true)
with check (true);

create unique index if not exists shoppinglist_rules_household_item_store_idx
on public.shoppinglist_rules (household_id, item_key, store);

create unique index if not exists shoppinglist_notes_household_id_idx
on public.shoppinglist_notes (household_id);

create unique index if not exists shoppinglist_stores_household_store_key_idx
on public.shoppinglist_stores (household_id, store_key);

create index if not exists shoppinglist_items_household_created_idx
on public.shoppinglist_items (household_id, created_at);

create index if not exists shoppinglist_note_items_household_lane_idx
on public.shoppinglist_note_items (household_id, lane, sort_order, created_at);

insert into public.shoppinglist_stores (household_id, store_key, store_label, sort_order)
values
  ('tod-donna-shared', 'shopping', 'Shopping', 10),
  ('tod-donna-shared', 'walmart', 'Walmart', 20),
  ('tod-donna-shared', 'super-one-negaunee', 'Super One Negaunee', 30),
  ('tod-donna-shared', 'menards', 'Menards', 40)
on conflict (household_id, store_key)
do update set
  store_label = excluded.store_label,
  sort_order = excluded.sort_order,
  updated_at = now();

-- migrate older shopping_* data into the isolated shoppinglist_* tables if present
DO $$
BEGIN
  IF to_regclass('public.shopping_items') IS NOT NULL THEN
    EXECUTE $sql$
      insert into public.shoppinglist_items (
        id, household_id, item_name, normalized_name, category, store, parent_target,
        purchased_main, parent_checked, on_shopping_list, delivered, removed,
        removed_reason, created_at, updated_at
      )
      select
        id,
        coalesce(nullif(household_id, ''), 'tod-donna-shared'),
        item_name,
        normalized_name,
        category,
        case when store = 'ours' then 'shopping' else store end,
        case when parent_target = 'shafer' then 'schaffer' else parent_target end,
        coalesce(purchased_main, false),
        coalesce(parent_checked, false),
        coalesce(on_shopping_list, true),
        coalesce(delivered, false),
        coalesce(removed, false),
        removed_reason,
        coalesce(created_at, now()),
        coalesce(updated_at, now())
      from public.shopping_items
      on conflict (id) do update set
        household_id = excluded.household_id,
        item_name = excluded.item_name,
        normalized_name = excluded.normalized_name,
        category = excluded.category,
        store = excluded.store,
        parent_target = excluded.parent_target,
        purchased_main = excluded.purchased_main,
        parent_checked = excluded.parent_checked,
        on_shopping_list = excluded.on_shopping_list,
        delivered = excluded.delivered,
        removed = excluded.removed,
        removed_reason = excluded.removed_reason,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shopping_rules') IS NOT NULL THEN
    EXECUTE $sql$
      insert into public.shoppinglist_rules (
        id, household_id, item_key, category, store, updated_at
      )
      select
        id,
        coalesce(nullif(household_id, ''), 'tod-donna-shared'),
        item_key,
        category,
        case when store = 'ours' then 'shopping' else store end,
        coalesce(updated_at, now())
      from public.shopping_rules
      on conflict (household_id, item_key, store) do update set
        category = excluded.category,
        updated_at = excluded.updated_at
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shopping_notes') IS NOT NULL THEN
    EXECUTE $sql$
      insert into public.shoppinglist_notes (
        household_id, body, updated_at
      )
      select
        coalesce(nullif(household_id, ''), 'tod-donna-shared'),
        body,
        coalesce(updated_at, now())
      from public.shopping_notes
      on conflict (household_id) do update set
        body = excluded.body,
        updated_at = excluded.updated_at
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shopping_stores') IS NOT NULL THEN
    EXECUTE $sql$
      insert into public.shoppinglist_stores (
        id, household_id, store_key, store_label, sort_order, created_at, updated_at
      )
      select
        id,
        coalesce(nullif(household_id, ''), 'tod-donna-shared'),
        store_key,
        case
          when store_key = 'shopping' and store_label = 'Groceries' then 'Shopping'
          else store_label
        end,
        coalesce(sort_order, 100),
        coalesce(created_at, now()),
        coalesce(updated_at, now())
      from public.shopping_stores
      where store_key is not null
      on conflict (household_id, store_key) do update set
        store_label = excluded.store_label,
        sort_order = excluded.sort_order,
        updated_at = excluded.updated_at
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shopping_note_items') IS NOT NULL THEN
    EXECUTE $sql$
      insert into public.shoppinglist_note_items (
        id, household_id, lane, body, is_checked, sort_order, created_at, updated_at
      )
      select
        id,
        coalesce(nullif(household_id, ''), 'tod-donna-shared'),
        case
          when lane in ('shared', 'donna', 'tod', 'trip-clothing', 'trip-tents', 'trip-fishing-gear', 'trip-boat-stuff', 'trip-cooking', 'trip-food', 'trip-toiletries', 'trip-bedding', 'trip-first-aid', 'trip-tools', 'trip-electronics', 'trip-paperwork', 'trip-dog-stuff', 'trip-misc') then lane
          else 'shared'
        end,
        body,
        coalesce(is_checked, false),
        coalesce(sort_order, extract(epoch from now())::bigint),
        coalesce(created_at, now()),
        coalesce(updated_at, now())
      from public.shopping_note_items
      on conflict (id) do update set
        household_id = excluded.household_id,
        lane = excluded.lane,
        body = excluded.body,
        is_checked = excluded.is_checked,
        sort_order = excluded.sort_order,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at
    $sql$;
  END IF;
END $$;

-- Realtime publication wiring for live sync
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'shoppinglist_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shoppinglist_items;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'shoppinglist_rules'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shoppinglist_rules;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'shoppinglist_stores'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shoppinglist_stores;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'shoppinglist_note_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shoppinglist_note_items;
  END IF;
END $$;
