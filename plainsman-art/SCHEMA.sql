-- ============================================
-- Plainsman Art — Supabase Schema
-- Run this in the Supabase SQL editor once the
-- project is created.
-- ============================================

-- Paintings (the catalog)
create table if not exists paintings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  category text default 'gameday',  -- gameday, historic, signed, skylines, ironbowl, commission
  status text default 'active',     -- active, draft, archived
  printify_product_id text,         -- set after Printify product is created
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Variants (sizes / prices per painting)
create table if not exists painting_variants (
  id uuid primary key default gen_random_uuid(),
  painting_id uuid references paintings(id) on delete cascade,
  size text not null,               -- e.g. "12x16", "18x24", "24x36"
  finish text default 'print',      -- print, framed, canvas
  price_cents int not null,         -- in cents
  printify_variant_id text,         -- Printify-side variant id
  stripe_price_id text,             -- Stripe Price object id
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_num text unique,            -- PA-2026-0001 style
  stripe_session_id text,
  stripe_payment_intent text,
  printify_order_id text,
  customer_name text,
  customer_email text,
  ship_address jsonb,
  status text default 'pending',    -- pending, paid, printing, shipped, cancelled
  total_cents int not null,
  tracking_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order line items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  painting_id uuid references paintings(id),
  variant_id uuid references painting_variants(id),
  qty int not null default 1,
  price_cents int not null,
  painting_title text,              -- snapshot at time of purchase
  variant_size text,
  variant_finish text
);

-- Indexes
create index if not exists idx_paintings_status on paintings(status);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);
create index if not exists idx_variants_painting on painting_variants(painting_id);
create index if not exists idx_items_order on order_items(order_id);

-- Storage bucket for painting uploads
-- Run separately in Supabase Storage UI:
--   create a bucket called "paintings", public read, owner-only write

-- RLS (Row Level Security)
alter table paintings enable row level security;
alter table painting_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read for active paintings (for storefront)
create policy "Public can view active paintings"
  on paintings for select
  using (status = 'active');

create policy "Public can view variants of active paintings"
  on painting_variants for select
  using (exists (
    select 1 from paintings p
    where p.id = painting_variants.painting_id
      and p.status = 'active'
  ));

-- Authenticated (Mike) can do everything
create policy "Authenticated full access to paintings"
  on paintings for all
  using (auth.role() = 'authenticated');

create policy "Authenticated full access to variants"
  on painting_variants for all
  using (auth.role() = 'authenticated');

create policy "Authenticated full access to orders"
  on orders for all
  using (auth.role() = 'authenticated');

create policy "Authenticated full access to order items"
  on order_items for all
  using (auth.role() = 'authenticated');

-- Trigger to bump updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_paintings_updated on paintings;
create trigger trg_paintings_updated
  before update on paintings
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated
  before update on orders
  for each row execute function set_updated_at();
