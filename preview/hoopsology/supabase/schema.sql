-- Hoopsology — Supabase schema. Run once in the SQL editor of Hoopsology's OWN project.
-- Then put the project URL + anon key in assets/config.js and the site flips to LIVE mode.

-- ───────── admins: who can publish ─────────
create table if not exists admins (
  user_id uuid primary key references auth.users on delete cascade,
  name text,
  created_at timestamptz default now()
);
alter table admins enable row level security;
create policy "admins read self" on admins for select using (auth.uid() = user_id);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- ───────── stories (the News / Lab Notes section) ─────────
create table if not exists stories (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  title text not null,
  dek text,
  category text default 'NBA',
  author text,
  cover text,
  video text,              -- optional YouTube id embedded at the top
  body text,               -- sanitized HTML (sanitized again on render)
  featured boolean default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published timestamptz,
  updated timestamptz default now()
);
alter table stories enable row level security;
create policy "public reads published" on stories for select
  using (status = 'published' and published <= now() or is_admin());
create policy "admins write" on stories for all using (is_admin()) with check (is_admin());

-- ───────── site settings (pinned hero episode, hidden videos) ─────────
create table if not exists site_settings (key text primary key, value jsonb not null default '{}');
alter table site_settings enable row level security;
create policy "public reads settings" on site_settings for select using (true);
create policy "admins write settings" on site_settings for all using (is_admin()) with check (is_admin());

-- ───────── Locker Room waitlist ─────────
create table if not exists waitlist (
  id bigint generated always as identity primary key,
  email text unique not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz default now()
);
alter table waitlist enable row level security;
create policy "anyone can join" on waitlist for insert with check (true);
create policy "admins read waitlist" on waitlist for select using (is_admin());

-- ───────── Phase 2: Locker Room forum (tables ready; UI comes later) ─────────
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  handle text unique not null check (handle ~ '^[A-Za-z0-9_]{3,20}$'),
  favorite_team text,
  is_subscriber boolean default false,   -- set by admins / a future Patreon-Stripe sync
  banned boolean default false,
  created_at timestamptz default now()
);
create table if not exists threads (
  id bigint generated always as identity primary key,
  author uuid references profiles on delete set null,
  room text not null default 'general',  -- general | nba | wnba | episode | subscribers
  title text not null check (char_length(title) between 3 and 140),
  video text,
  pinned boolean default false,
  locked boolean default false,
  created_at timestamptz default now()
);
create table if not exists posts (
  id bigint generated always as identity primary key,
  thread bigint references threads on delete cascade,
  author uuid references profiles on delete set null,
  body text not null check (char_length(body) between 1 and 5000),
  hidden boolean default false,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
alter table threads enable row level security;
alter table posts enable row level security;
create policy "profiles public" on profiles for select using (true);
create policy "own profile" on profiles for insert with check (auth.uid() = id);
create policy "edit own profile" on profiles for update using (auth.uid() = id) with check (auth.uid() = id and not banned);
create policy "read threads" on threads for select using (
  room <> 'subscribers' or is_admin() or exists (select 1 from profiles p where p.id = auth.uid() and p.is_subscriber));
create policy "start threads" on threads for insert with check (
  auth.uid() = author and not exists (select 1 from profiles p where p.id = auth.uid() and p.banned));
create policy "read posts" on posts for select using (not hidden or is_admin());
create policy "write posts" on posts for insert with check (
  auth.uid() = author and not exists (select 1 from profiles p where p.id = auth.uid() and p.banned));
create policy "mods manage threads" on threads for update using (is_admin());
create policy "mods manage posts" on posts for update using (is_admin());

-- After creating an admin user in Auth → Users:
-- insert into admins (user_id, name) values ('<uuid>', 'Matt Thomas');
