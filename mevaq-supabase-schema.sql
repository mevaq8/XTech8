-- ============================================================
-- Mevaq / XTech IT Store - Supabase Schema
-- Admin panel + public ecommerce storefront
-- ============================================================
-- Run this in Supabase Dashboard > SQL Editor.
-- This creates the tables used by the integrated admin panel.
-- It does NOT insert demo products.
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- Tables
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text not null default 'Tag',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price is null or sale_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  short_desc text,
  description text,
  specs jsonb not null default '{}'::jsonb,
  images text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  items jsonb not null,
  total_amount numeric(10,2) not null check (total_amount >= 0),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Updated-at trigger for settings
-- ============================================================

create or replace function public.set_settings_updated_at()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

drop trigger if exists trg_settings_updated_at on public.settings;

create trigger trg_settings_updated_at
before update on public.settings
for each row
execute function public.set_settings_updated_at();

-- ============================================================
-- Auth profile trigger
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Admin'),
    'admin'
  )
  on conflict (id) do nothing;

  return new;
end;
$function$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_active_sort on public.categories(is_active, sort_order);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active_stock on public.products(is_active, stock);
create index if not exists idx_products_created_at on public.products(created_at desc);

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_settings_key on public.settings(key);

alter table public.products
add column if not exists specs jsonb not null default '{}'::jsonb;

-- ============================================================
-- Realtime sync for storefront updates
-- ============================================================
-- The React app listens to product/category/settings changes and refreshes the
-- storefront catalog. These statements make sure Supabase Realtime emits
-- those database changes.

alter table public.products replica identity full;
alter table public.categories replica identity full;
alter table public.settings replica identity full;

do $do$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'products'
    ) then
      execute 'alter publication supabase_realtime add table public.products';
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'categories'
    ) then
      execute 'alter publication supabase_realtime add table public.categories';
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'settings'
    ) then
      execute 'alter publication supabase_realtime add table public.settings';
    end if;
  end if;
end;
$do$;

-- ============================================================
-- Seed categories only
-- Demo products are intentionally NOT inserted.
-- ============================================================

insert into public.categories (name, slug, icon, sort_order, is_active)
values
  ('Noutbuklar', 'noutbuklar', 'Laptop', 10, true),
  ('Komputerler', 'komputerler', 'MonitorCog', 20, true),
  ('Monitorlar', 'monitorlar', 'Monitor', 30, true),
  ('Aksesuarlar', 'aksesuarlar', 'Mouse', 40, true),
  ('Printerler', 'printerler', 'Printer', 50, true),
  ('Proyektorlar', 'proyektorlar', 'Projector', 60, true),
  ('IT Avadanliqlari', 'it-avadanliqlari', 'Cable', 70, true)
on conflict (slug) do update
set
  name = excluded.name,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "categories_public_read_active" on public.categories;
drop policy if exists "categories_admin_all" on public.categories;
drop policy if exists "products_public_read_active" on public.products;
drop policy if exists "products_admin_all" on public.products;
drop policy if exists "orders_admin_all" on public.orders;
drop policy if exists "settings_public_read" on public.settings;
drop policy if exists "settings_admin_all" on public.settings;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Storefront can read active categories.
-- Admin can create, edit, deactivate, and delete categories after login.
create policy "categories_public_read_active"
on public.categories
for select
to anon, authenticated
using (is_active = true or auth.role() = 'authenticated');

create policy "categories_admin_all"
on public.categories
for all
to authenticated
using (true)
with check (true);

-- Storefront can read only active products.
-- The app additionally hides out-of-stock products on the frontend.
-- Admin can manage all products after login.
create policy "products_public_read_active"
on public.products
for select
to anon, authenticated
using (is_active = true or auth.role() = 'authenticated');

create policy "products_admin_all"
on public.products
for all
to authenticated
using (true)
with check (true);

create policy "orders_admin_all"
on public.orders
for all
to authenticated
using (true)
with check (true);

create policy "settings_public_read"
on public.settings
for select
to anon, authenticated
using (true);

create policy "settings_admin_all"
on public.settings
for all
to authenticated
using (true)
with check (true);

-- ============================================================
-- Storage buckets
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('site-assets', 'site-assets', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_insert" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;
drop policy if exists "site_assets_public_read" on storage.objects;
drop policy if exists "site_assets_admin_insert" on storage.objects;
drop policy if exists "site_assets_admin_update" on storage.objects;
drop policy if exists "site_assets_admin_delete" on storage.objects;

create policy "product_images_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "product_images_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

create policy "product_images_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy "product_images_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images');

create policy "site_assets_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-assets');

create policy "site_assets_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-assets');

create policy "site_assets_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-assets')
with check (bucket_id = 'site-assets');

create policy "site_assets_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-assets');

-- ============================================================
-- After running:
-- 1. Supabase Dashboard > Authentication > Users > Add user
-- 2. Create admin email/password.
-- 3. Login from /admin/login.
-- ============================================================
