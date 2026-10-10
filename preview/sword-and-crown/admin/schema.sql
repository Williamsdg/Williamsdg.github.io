-- Sword and Crown Salon and Studio — publishing system schema
--
-- Satisfies agreement §8: "The site is built specifically so none of that
-- requires a developer."
--
-- HOW TO APPLY
--   1. Create a Supabase project named `sword-and-crown` (Dylan must do this;
--      Claude is not permitted to create billable projects).
--   2. Paste this whole file into the project's SQL editor and run it.
--   3. Create a user for Elana under Authentication, then run the INSERT at the
--      bottom of this file with that user's id to grant her admin access.
--   4. Put the project URL and the publishable (anon) key into
--      assets/sc-config.js (one file; the site and the admin both read it).
--
-- There are no secrets in this file. It is safe to commit.

-- ─────────────────────────── products ───────────────────────────
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  sort          int         not null default 0,
  published     boolean     not null default false,
  category      text        not null check (category in ('wigs','toppers','accessories','care')),
  name          text        not null,
  blurb         text,
  price_cents   int         check (price_cents is null or price_cents >= 0),
  stock         int         not null default 0 check (stock >= 0),
  -- wig-specific spec, all nullable so accessories aren't forced to carry it
  cap           text,
  length        text,
  texture       text,
  density       text,
  colour        text,
  image_url     text,
  image_alt     text
);

-- ─────────────────────────── articles ───────────────────────────
-- One table, two surfaces: the Wig Bible (educational) and the Journal
-- (news / launches / events). The Sept 14 scope note is explicit that these
-- share the *same publishing editor*, so they share one table and one form.
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  kind          text        not null check (kind in ('wig-bible','journal')),
  published     boolean     not null default false,
  published_at  timestamptz,
  slug          text        not null,
  title         text        not null,
  excerpt       text,
  body          text,
  cover_url     text,
  cover_alt     text,
  read_minutes  int,
  unique (kind, slug)
);

-- ─────────────────────── single-row content ─────────────────────
-- key/value so new fields never need a migration: hours, phone, booking URL,
-- the non-profit page, the policy figures that are currently bracketed blanks.
create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ───────────────────────── who may write ────────────────────────
-- A membership table rather than a hardcoded email, so Dylan and Elana can
-- both hold access and either can be revoked without a deploy.
create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  email    text,
  added_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ──────────────────────────── RLS ───────────────────────────────
alter table public.products enable row level security;
alter table public.articles enable row level security;
alter table public.settings enable row level security;
alter table public.admins   enable row level security;

-- The public website reads only what has been published.
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select to anon, authenticated using (published = true);

drop policy if exists articles_public_read on public.articles;
create policy articles_public_read on public.articles
  for select to anon, authenticated using (published = true);

drop policy if exists settings_public_read on public.settings;
create policy settings_public_read on public.settings
  for select to anon, authenticated using (true);

-- Admins see everything, including drafts, and are the only writers.
drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists articles_admin_all on public.articles;
create policy articles_admin_all on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists settings_admin_write on public.settings;
create policy settings_admin_write on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ───────────────────────── housekeeping ─────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists articles_touch on public.articles;
create trigger articles_touch before update on public.articles
  for each row execute function public.touch_updated_at();

create index if not exists products_live_idx on public.products (published, category, sort);
create index if not exists articles_live_idx on public.articles (kind, published, published_at desc);

-- ───────────────────── storage for photography ──────────────────
insert into storage.buckets (id, name, public)
values ('media','media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects
  for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- Seed the settings keys the site reads, so the admin renders a complete form.
insert into public.settings (key, value) values
  ('contact',  '{"phone":"","hours":"","booking_url":""}'::jsonb),
  ('nonprofit','{"name":"","mission":"","body":"","involve":"","contact":""}'::jsonb),
  ('policies', '{"ship_days":"","ship_area":"","delivery_days":"","custom_weeks":"","return_days":"","return_outcome":"","damaged_days":"","care_days":"","deposit":"","notice_hours":"","notice_outcome":"","late_minutes":"","noshow":""}'::jsonb)
on conflict (key) do nothing;

-- ───────────────────────── grant access ─────────────────────────
-- After creating Elana's user under Authentication → Users, run this with her id:
--
--   insert into public.admins (user_id, email)
--   values ('00000000-0000-0000-0000-000000000000', 'swordandcrownsalon@gmail.com');
--
-- Until at least one row exists here, nobody can write anything — which is the
-- intended default.

-- ═══════════════════════════════════════════════════════════════════
-- CONSULTATIONS  (added 2026-10-02, from Elana's revision notes §6)
-- Rules she specified: Monday–Friday, 10:00–16:00 America/Chicago,
-- 90-minute appointments, so the latest start is 14:30. $250 deposit,
-- nonrefundable, credited against a wig bought during the consultation.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  -- the slot, stored as a date + local start time in the salon's timezone
  slot_date      date not null,
  slot_start     time not null,
  duration_min   int  not null default 90,
  status         text not null default 'held'
                 check (status in ('held','paid','cancelled','completed','no_show')),
  name           text not null,
  email          text not null,
  phone          text,
  notes          text,
  -- deposit
  deposit_cents  int  not null default 25000,
  deposit_ref    text,            -- Stripe payment/session reference
  terms_ack_at   timestamptz,     -- she asked that the terms be acknowledged
  unique (slot_date, slot_start)  -- prevents overlapping bookings outright
);

-- Dates or specific times the salon is unavailable, managed from the admin.
create table if not exists public.blackouts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  day         date not null,
  start_time  time,          -- null = the whole day is blocked
  end_time    time,
  reason      text
);

alter table public.bookings  enable row level security;
alter table public.blackouts enable row level security;

-- The public page needs to know which slots are gone, but must never see
-- who booked them. It reads availability through this view instead.
create or replace view public.slots_taken as
  select slot_date, slot_start
  from public.bookings
  where status in ('held','paid','completed');

grant select on public.slots_taken to anon, authenticated;

-- Blackouts are not sensitive; the calendar needs them to grey days out.
drop policy if exists blackouts_public_read on public.blackouts;
create policy blackouts_public_read on public.blackouts
  for select to anon, authenticated using (true);

drop policy if exists blackouts_admin_all on public.blackouts;
create policy blackouts_admin_all on public.blackouts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Anyone may request a booking; nobody but an admin may read them back.
-- This is deliberate: bookings carry names, emails and phone numbers.
drop policy if exists bookings_public_insert on public.bookings;
create policy bookings_public_insert on public.bookings
  for insert to anon, authenticated with check (
    status = 'held'
    and extract(isodow from slot_date) between 1 and 5
    and slot_start >= time '10:00' and slot_start <= time '14:30'
  );

drop policy if exists bookings_admin_all on public.bookings;
create policy bookings_admin_all on public.bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create index if not exists bookings_day_idx  on public.bookings (slot_date, slot_start);
create index if not exists blackouts_day_idx on public.blackouts (day);

-- ═══════════════════════════════════════════════════════════════════
-- SERVICES, STAFF AND REQUESTS  (2026-10-09, from her 10-04 notes)
-- Three departments, each with independently editable availability and
-- its own menu:
--   nano-brows  Natalie Henderson      Tue/Thu + special, calendar
--   head-spa    Constantina A.         Mon/Wed/Fri, calendar
--   styling     technician-managed     request form, internal calendar
-- Across everything, 16:00 America/Chicago is the latest START.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.staff (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  slug        text unique not null,
  name        text not null,
  role        text,
  bio         text,
  photo_url   text,
  active      boolean not null default true,
  sort        int not null default 0
);

create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  department    text not null check (department in ('nano-brows','head-spa','styling')),
  name          text not null,
  description   text,
  duration_min  int  not null default 60 check (duration_min > 0),
  price_cents   int  check (price_cents is null or price_cents >= 0),
  deposit_cents int  not null default 0 check (deposit_cents >= 0),
  -- some services ask the client to pick a variant, e.g. Nano Brows vs
  -- Restorative Tattooing on a shared consultation slot
  options       text[],
  staff_id      uuid references public.staff(id) on delete set null,
  bookable      boolean not null default true,   -- false = by request only
  published     boolean not null default false,
  sort          int not null default 0,
  photo_url     text
);

-- Which weekdays each department opens. 1=Mon .. 7=Sun, per Postgres isodow.
create table if not exists public.department_hours (
  department  text primary key check (department in ('nano-brows','head-spa','styling')),
  weekdays    int[] not null,
  open_time   time not null default '10:00',
  last_start  time not null default '16:00',
  by_request  boolean not null default false
);

insert into public.department_hours (department, weekdays, open_time, last_start, by_request) values
  ('nano-brows', '{2,4}',       '10:00','16:00', false),  -- Tuesday, Thursday
  ('head-spa',   '{1,3,5}',     '10:00','16:00', false),  -- Mon, Wed, Fri
  ('styling',    '{1,2,3,4,5}', '10:00','16:00', true)    -- request form only
on conflict (department) do nothing;

-- Appointment requests from the styling form. She asked that these be saved
-- here FIRST, with email only as a notification, so nothing is lost if a
-- mailbox bounces or is not set up yet.
create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  email       text not null,
  service     text not null,
  details     text,
  status      text not null default 'new'
              check (status in ('new','contacted','booked','closed')),
  staff_note  text
);

alter table public.staff             enable row level security;
alter table public.services          enable row level security;
alter table public.department_hours  enable row level security;
alter table public.requests          enable row level security;

drop policy if exists staff_public_read on public.staff;
create policy staff_public_read on public.staff
  for select to anon, authenticated using (active = true);

drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services
  for select to anon, authenticated using (published = true);

drop policy if exists dephours_public_read on public.department_hours;
create policy dephours_public_read on public.department_hours
  for select to anon, authenticated using (true);

-- Anyone may submit a request; only an admin may read them back. They carry
-- names, phone numbers and what someone wants done to their hair.
drop policy if exists requests_public_insert on public.requests;
create policy requests_public_insert on public.requests
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists requests_admin_all on public.requests;
create policy requests_admin_all on public.requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists staff_admin_all on public.staff;
create policy staff_admin_all on public.staff
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists services_admin_all on public.services;
create policy services_admin_all on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists dephours_admin_all on public.department_hours;
create policy dephours_admin_all on public.department_hours
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop trigger if exists services_touch on public.services;
create trigger services_touch before update on public.services
  for each row execute function public.touch_updated_at();

create index if not exists services_dept_idx on public.services (department, published, sort);
create index if not exists requests_new_idx  on public.requests (status, created_at desc);

-- bookings needs to know which service and which technician, so two
-- appointments with the same person cannot overlap.
alter table public.bookings add column if not exists service_id uuid references public.services(id) on delete set null;
alter table public.bookings add column if not exists staff_id   uuid references public.staff(id) on delete set null;
alter table public.bookings add column if not exists department text;

-- The original unique(slot_date, slot_start) assumed one chair. With three
-- departments it must be per technician instead.
alter table public.bookings drop constraint if exists bookings_slot_date_slot_start_key;
create unique index if not exists bookings_staff_slot_uniq
  on public.bookings (staff_id, slot_date, slot_start) where staff_id is not null;
create unique index if not exists bookings_consult_slot_uniq
  on public.bookings (slot_date, slot_start) where staff_id is null;
