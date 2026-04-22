-- Shared Shopping List schema v1.7.1
-- Airtight isolation revision.
-- This app now lives in its own dedicated schema: tod_donna_shared_shopping
-- IMPORTANT AFTER RUNNING THIS SQL:
-- 1) Supabase Dashboard > Project Settings > API > Exposed schemas
-- 2) Add: tod_donna_shared_shopping
-- 3) Save, then hard refresh the app
-- Anonymous sign-in must also be enabled under Authentication > Providers.

create extension if not exists pgcrypto;
create schema if not exists tod_donna_shared_shopping;

revoke all on schema tod_donna_shared_shopping from public;
grant usage on schema tod_donna_shared_shopping to authenticated, service_role;

grant select, insert, update, delete on all tables in schema tod_donna_shared_shopping to authenticated;
grant all privileges on all tables in schema tod_donna_shared_shopping to service_role;
alter default privileges in schema tod_donna_shared_shopping grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema tod_donna_shared_shopping grant all privileges on tables to service_role;

create table if not exists tod_donna_shared_shopping.items (
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

create table if not exists tod_donna_shared_shopping.rules (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  item_key text not null,
  category text not null,
  store text not null,
  updated_at timestamptz not null default now(),
  unique (household_id, item_key, store)
);

create table if not exists tod_donna_shared_shopping.notes (
  household_id text primary key default 'tod-donna-shared',
  body text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists tod_donna_shared_shopping.stores (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  store_key text not null,
  store_label text not null,
  sort_order integer not null default 100,
  route_categories jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, store_key)
);

create table if not exists tod_donna_shared_shopping.categories (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  category_name text not null,
  sort_order integer not null default 100,
  is_builtin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, category_name)
);

create table if not exists tod_donna_shared_shopping.note_items (
  id uuid primary key default gen_random_uuid(),
  household_id text not null default 'tod-donna-shared',
  lane text not null default 'shared',
  body text not null,
  is_checked boolean not null default false,
  sort_order bigint not null default extract(epoch from now())::bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_household_idx on tod_donna_shared_shopping.items (household_id);
create index if not exists items_household_active_idx on tod_donna_shared_shopping.items (household_id, removed, on_shopping_list, delivered);
create index if not exists rules_household_idx on tod_donna_shared_shopping.rules (household_id);
create index if not exists stores_household_sort_idx on tod_donna_shared_shopping.stores (household_id, sort_order, created_at);
create index if not exists categories_household_sort_idx on tod_donna_shared_shopping.categories (household_id, sort_order, category_name);
create index if not exists note_items_household_lane_sort_idx on tod_donna_shared_shopping.note_items (household_id, lane, sort_order, created_at);

alter table tod_donna_shared_shopping.items drop constraint if exists items_parent_target_check;
alter table tod_donna_shared_shopping.items drop constraint if exists items_removed_reason_check;
alter table tod_donna_shared_shopping.note_items drop constraint if exists note_items_lane_check;

alter table tod_donna_shared_shopping.items
  add constraint items_parent_target_check
  check (parent_target in ('poirier', 'schaffer') or parent_target is null);

alter table tod_donna_shared_shopping.items
  add constraint items_removed_reason_check
  check (removed_reason in ('manual', 'shopped', 'delivered') or removed_reason is null);

alter table tod_donna_shared_shopping.note_items
  add constraint note_items_lane_check
  check (lane in ('shared', 'donna', 'tod', 'trip-clothing', 'trip-tents', 'trip-fishing-gear', 'trip-boat-stuff', 'trip-cooking', 'trip-food', 'trip-toiletries', 'trip-bedding', 'trip-first-aid', 'trip-tools', 'trip-electronics', 'trip-paperwork', 'trip-dog-stuff', 'trip-misc'));

create or replace function tod_donna_shared_shopping.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_updated_at on tod_donna_shared_shopping.items;
create trigger items_updated_at before update on tod_donna_shared_shopping.items for each row execute function tod_donna_shared_shopping.set_updated_at();

drop trigger if exists rules_updated_at on tod_donna_shared_shopping.rules;
create trigger rules_updated_at before update on tod_donna_shared_shopping.rules for each row execute function tod_donna_shared_shopping.set_updated_at();

drop trigger if exists notes_updated_at on tod_donna_shared_shopping.notes;
create trigger notes_updated_at before update on tod_donna_shared_shopping.notes for each row execute function tod_donna_shared_shopping.set_updated_at();

drop trigger if exists stores_updated_at on tod_donna_shared_shopping.stores;
create trigger stores_updated_at before update on tod_donna_shared_shopping.stores for each row execute function tod_donna_shared_shopping.set_updated_at();

drop trigger if exists categories_updated_at on tod_donna_shared_shopping.categories;
create trigger categories_updated_at before update on tod_donna_shared_shopping.categories for each row execute function tod_donna_shared_shopping.set_updated_at();

drop trigger if exists note_items_updated_at on tod_donna_shared_shopping.note_items;
create trigger note_items_updated_at before update on tod_donna_shared_shopping.note_items for each row execute function tod_donna_shared_shopping.set_updated_at();

alter table tod_donna_shared_shopping.items enable row level security;
alter table tod_donna_shared_shopping.rules enable row level security;
alter table tod_donna_shared_shopping.notes enable row level security;
alter table tod_donna_shared_shopping.stores enable row level security;
alter table tod_donna_shared_shopping.categories enable row level security;
alter table tod_donna_shared_shopping.note_items enable row level security;

drop policy if exists items_household_policy on tod_donna_shared_shopping.items;
drop policy if exists rules_household_policy on tod_donna_shared_shopping.rules;
drop policy if exists notes_household_policy on tod_donna_shared_shopping.notes;
drop policy if exists stores_household_policy on tod_donna_shared_shopping.stores;
drop policy if exists categories_household_policy on tod_donna_shared_shopping.categories;
drop policy if exists note_items_household_policy on tod_donna_shared_shopping.note_items;

create policy items_household_policy on tod_donna_shared_shopping.items
  for all to authenticated
  using (household_id = 'tod-donna-shared')
  with check (household_id = 'tod-donna-shared');

create policy rules_household_policy on tod_donna_shared_shopping.rules
  for all to authenticated
  using (household_id = 'tod-donna-shared')
  with check (household_id = 'tod-donna-shared');

create policy notes_household_policy on tod_donna_shared_shopping.notes
  for all to authenticated
  using (household_id = 'tod-donna-shared')
  with check (household_id = 'tod-donna-shared');

create policy stores_household_policy on tod_donna_shared_shopping.stores
  for all to authenticated
  using (household_id = 'tod-donna-shared')
  with check (household_id = 'tod-donna-shared');

create policy categories_household_policy on tod_donna_shared_shopping.categories
  for all to authenticated
  using (household_id = 'tod-donna-shared')
  with check (household_id = 'tod-donna-shared');

create policy note_items_household_policy on tod_donna_shared_shopping.note_items
  for all to authenticated
  using (household_id = 'tod-donna-shared')
  with check (household_id = 'tod-donna-shared');

-- First migrate from the newer public.shoppinglist_* family if it exists.
DO $$
BEGIN
  IF to_regclass('public.shoppinglist_items') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.items (
      id, household_id, item_name, normalized_name, category, store, parent_target,
      purchased_main, parent_checked, on_shopping_list, delivered, removed,
      removed_reason, created_at, updated_at
    )
    SELECT
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
    FROM public.shoppinglist_items
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shoppinglist_rules') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.rules (id, household_id, item_key, category, store, updated_at)
    SELECT
      id,
      coalesce(nullif(household_id, ''), 'tod-donna-shared'),
      item_key,
      category,
      case when store = 'ours' then 'shopping' else store end,
      coalesce(updated_at, now())
    FROM public.shoppinglist_rules
    ON CONFLICT (household_id, item_key, store) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shoppinglist_notes') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.notes (household_id, body, updated_at)
    SELECT
      coalesce(nullif(household_id, ''), 'tod-donna-shared'),
      body,
      coalesce(updated_at, now())
    FROM public.shoppinglist_notes
    ON CONFLICT (household_id) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shoppinglist_categories') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.categories (id, household_id, category_name, sort_order, is_builtin, created_at, updated_at)
    SELECT
      id,
      coalesce(nullif(household_id, ''), 'tod-donna-shared'),
      category_name,
      coalesce(sort_order, 100),
      coalesce(is_builtin, false),
      coalesce(created_at, now()),
      coalesce(updated_at, now())
    FROM public.shoppinglist_categories
    ON CONFLICT (household_id, category_name) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shoppinglist_stores') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.stores (id, household_id, store_key, store_label, sort_order, route_categories, created_at, updated_at)
    SELECT
      id,
      coalesce(nullif(household_id, ''), 'tod-donna-shared'),
      store_key,
      case when store_key = 'shopping' and store_label = 'Groceries' then 'Shopping' else store_label end,
      coalesce(sort_order, 100),
      case
        when route_categories is null or jsonb_typeof(route_categories) <> 'array' then '[]'::jsonb
        else route_categories
      end,
      coalesce(created_at, now()),
      coalesce(updated_at, now())
    FROM public.shoppinglist_stores
    WHERE store_key is not null
    ON CONFLICT (household_id, store_key) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shoppinglist_note_items') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.note_items (id, household_id, lane, body, is_checked, sort_order, created_at, updated_at)
    SELECT
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
    FROM public.shoppinglist_note_items
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Then migrate from the oldest public.shopping_* family if it exists.
DO $$
BEGIN
  IF to_regclass('public.shopping_items') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.items (
      id, household_id, item_name, normalized_name, category, store, parent_target,
      purchased_main, parent_checked, on_shopping_list, delivered, removed,
      removed_reason, created_at, updated_at
    )
    SELECT
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
    FROM public.shopping_items
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shopping_rules') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.rules (id, household_id, item_key, category, store, updated_at)
    SELECT
      id,
      coalesce(nullif(household_id, ''), 'tod-donna-shared'),
      item_key,
      category,
      case when store = 'ours' then 'shopping' else store end,
      coalesce(updated_at, now())
    FROM public.shopping_rules
    ON CONFLICT (household_id, item_key, store) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shopping_notes') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.notes (household_id, body, updated_at)
    SELECT
      coalesce(nullif(household_id, ''), 'tod-donna-shared'),
      body,
      coalesce(updated_at, now())
    FROM public.shopping_notes
    ON CONFLICT (household_id) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shopping_stores') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.stores (id, household_id, store_key, store_label, sort_order, route_categories, created_at, updated_at)
    SELECT
      id,
      coalesce(nullif(household_id, ''), 'tod-donna-shared'),
      store_key,
      case when store_key = 'shopping' and store_label = 'Groceries' then 'Shopping' else store_label end,
      coalesce(sort_order, 100),
      '[]'::jsonb,
      coalesce(created_at, now()),
      coalesce(updated_at, now())
    FROM public.shopping_stores
    WHERE store_key is not null
    ON CONFLICT (household_id, store_key) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.shopping_note_items') IS NOT NULL THEN
    INSERT INTO tod_donna_shared_shopping.note_items (id, household_id, lane, body, is_checked, sort_order, created_at, updated_at)
    SELECT
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
    FROM public.shopping_note_items
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

update tod_donna_shared_shopping.items set store = 'shopping' where store = 'ours';
update tod_donna_shared_shopping.rules set store = 'shopping' where store = 'ours';
update tod_donna_shared_shopping.items set parent_target = 'schaffer' where parent_target = 'shafer';
update tod_donna_shared_shopping.stores
set route_categories = '[]'::jsonb
where route_categories is null or jsonb_typeof(route_categories) <> 'array';
update tod_donna_shared_shopping.note_items
set lane = 'shared'
where lane not in ('shared', 'donna', 'tod', 'trip-clothing', 'trip-tents', 'trip-fishing-gear', 'trip-boat-stuff', 'trip-cooking', 'trip-food', 'trip-toiletries', 'trip-bedding', 'trip-first-aid', 'trip-tools', 'trip-electronics', 'trip-paperwork', 'trip-dog-stuff', 'trip-misc')
   or lane is null;

insert into tod_donna_shared_shopping.categories (household_id, category_name, sort_order, is_builtin)
values
  ('tod-donna-shared', 'Fruit', 10, true),
  ('tod-donna-shared', 'Vegetables', 20, true),
  ('tod-donna-shared', 'Frozen', 30, true),
  ('tod-donna-shared', 'Condiments', 40, true),
  ('tod-donna-shared', 'Gluten Free', 50, true),
  ('tod-donna-shared', 'Canned', 60, true),
  ('tod-donna-shared', 'Ethnic', 70, true),
  ('tod-donna-shared', 'Dried', 80, true),
  ('tod-donna-shared', 'Spices', 90, true),
  ('tod-donna-shared', 'Baking supplies', 100, true),
  ('tod-donna-shared', 'Snacks', 110, true),
  ('tod-donna-shared', 'Baked goods', 120, true),
  ('tod-donna-shared', 'Coffee/Tea', 130, true),
  ('tod-donna-shared', 'Juice/Pop', 140, true),
  ('tod-donna-shared', 'Dairy', 150, true),
  ('tod-donna-shared', 'Eggs', 160, true),
  ('tod-donna-shared', 'Cheese', 170, true),
  ('tod-donna-shared', 'Meat', 180, true),
  ('tod-donna-shared', 'Alcohol', 190, true),
  ('tod-donna-shared', 'Paper Goods', 200, true),
  ('tod-donna-shared', 'Cleaning Supplies', 210, true),
  ('tod-donna-shared', 'Pet Supplies', 220, true),
  ('tod-donna-shared', 'Clothes', 230, true),
  ('tod-donna-shared', 'Sporting Goods', 240, true),
  ('tod-donna-shared', 'Household', 250, true),
  ('tod-donna-shared', 'Gardening', 260, true),
  ('tod-donna-shared', 'Holiday', 270, true),
  ('tod-donna-shared', 'Health and Beauty', 280, true),
  ('tod-donna-shared', 'Candy', 290, true),
  ('tod-donna-shared', 'Plumbing', 300, true),
  ('tod-donna-shared', 'Flooring', 310, true),
  ('tod-donna-shared', 'Paint', 320, true),
  ('tod-donna-shared', 'Fasteners', 330, true),
  ('tod-donna-shared', 'Tools', 340, true),
  ('tod-donna-shared', 'Windows/Doors', 350, true),
  ('tod-donna-shared', 'Lumber', 360, true),
  ('tod-donna-shared', 'Shelving', 370, true),
  ('tod-donna-shared', 'Auto', 380, true),
  ('tod-donna-shared', 'Other', 390, true)
on conflict (household_id, category_name) do nothing;

insert into tod_donna_shared_shopping.stores (household_id, store_key, store_label, sort_order, route_categories)
values
  ('tod-donna-shared', 'shopping', 'Shopping', 10, '[]'::jsonb),
  ('tod-donna-shared', 'walmart', 'Walmart', 20, '["Fruit","Vegetables","Frozen","Condiments","Gluten Free","Canned","Ethnic","Dried","Spices","Baking supplies","Snacks","Baked goods","Coffee/Tea","Juice/Pop","Dairy","Eggs","Cheese","Meat","Alcohol","Paper Goods","Cleaning Supplies","Pet Supplies","Clothes","Sporting Goods","Household","Gardening","Holiday","Health and Beauty","Candy"]'::jsonb),
  ('tod-donna-shared', 'meiers', 'Meier''s', 30, '["Fruit","Vegetables","Meat","Baked goods","Condiments","Canned","Dried","Ethnic","Spices","Baking supplies","Coffee/Tea","Cheese","Frozen","Dairy","Eggs","Cleaning Supplies","Snacks","Paper Goods","Candy","Juice/Pop","Alcohol","Clothes","Health and Beauty","Gardening","Pet Supplies"]'::jsonb),
  ('tod-donna-shared', 'super-one-negaunee', 'Super One Negaunee', 40, '["Fruit","Vegetables","Condiments","Meat","Canned","Gluten Free","Ethnic","Baking supplies","Coffee/Tea","Paper Goods","Snacks","Dairy","Eggs","Frozen","Alcohol"]'::jsonb),
  ('tod-donna-shared', 'menards', 'Menards', 50, '["Gardening","Plumbing","Flooring","Paint","Pet Supplies","Fasteners","Tools","Windows/Doors","Lumber","Shelving","Auto"]'::jsonb),
  ('tod-donna-shared', 'super-one-marquette', 'Super One Marquette', 60, '[]'::jsonb),
  ('tod-donna-shared', 'mqt-food-co-op', 'Mqt. Food Co-Op', 70, '[]'::jsonb)
on conflict (household_id, store_key) do nothing;

-- Realtime publication wiring for live sync.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel pr
      JOIN pg_publication p ON p.oid = pr.prpubid
      JOIN pg_class c ON c.oid = pr.prrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE p.pubname = 'supabase_realtime' AND n.nspname = 'tod_donna_shared_shopping' AND c.relname = 'items'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE tod_donna_shared_shopping.items;
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel pr
      JOIN pg_publication p ON p.oid = pr.prpubid
      JOIN pg_class c ON c.oid = pr.prrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE p.pubname = 'supabase_realtime' AND n.nspname = 'tod_donna_shared_shopping' AND c.relname = 'rules'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE tod_donna_shared_shopping.rules;
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel pr
      JOIN pg_publication p ON p.oid = pr.prpubid
      JOIN pg_class c ON c.oid = pr.prrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE p.pubname = 'supabase_realtime' AND n.nspname = 'tod_donna_shared_shopping' AND c.relname = 'stores'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE tod_donna_shared_shopping.stores;
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel pr
      JOIN pg_publication p ON p.oid = pr.prpubid
      JOIN pg_class c ON c.oid = pr.prrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE p.pubname = 'supabase_realtime' AND n.nspname = 'tod_donna_shared_shopping' AND c.relname = 'categories'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE tod_donna_shared_shopping.categories;
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel pr
      JOIN pg_publication p ON p.oid = pr.prpubid
      JOIN pg_class c ON c.oid = pr.prrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE p.pubname = 'supabase_realtime' AND n.nspname = 'tod_donna_shared_shopping' AND c.relname = 'note_items'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE tod_donna_shared_shopping.note_items;
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel pr
      JOIN pg_publication p ON p.oid = pr.prpubid
      JOIN pg_class c ON c.oid = pr.prrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE p.pubname = 'supabase_realtime' AND n.nspname = 'tod_donna_shared_shopping' AND c.relname = 'notes'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE tod_donna_shared_shopping.notes;
    END IF;
  END IF;
END $$;
