-- 0003_app_tables.sql
-- Minimal app tables with owner-based RLS. Adjust fields as needed for your app.

create extension if not exists "pgcrypto";

create table if not exists public.hinges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Hinge',
  status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.hinges enable row level security;

-- Row ownership policies
drop policy if exists "Hinges are viewable by owner" on public.hinges;
create policy "Hinges are viewable by owner"
on public.hinges for select
using (user_id = auth.uid());

drop policy if exists "Hinges are insertable by owner" on public.hinges;
create policy "Hinges are insertable by owner"
on public.hinges for insert
with check (user_id = auth.uid());

drop policy if exists "Hinges are updatable by owner" on public.hinges;
create policy "Hinges are updatable by owner"
on public.hinges for update
using (user_id = auth.uid());

drop policy if exists "Hinges are deletable by owner" on public.hinges;
create policy "Hinges are deletable by owner"
on public.hinges for delete
using (user_id = auth.uid());

-- Events table
create table if not exists public.hinge_events (
  id bigserial primary key,
  hinge_id uuid not null references public.hinges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists hinge_events_hinge_created_idx on public.hinge_events (hinge_id, created_at desc);

alter table public.hinge_events enable row level security;

-- Only owners can see their events
drop policy if exists "Hinge events viewable by owner" on public.hinge_events;
create policy "Hinge events viewable by owner"
on public.hinge_events for select
using (user_id = auth.uid());

-- Only owners can insert events for their hinge
drop policy if exists "Hinge events insertable by owner" on public.hinge_events;
create policy "Hinge events insertable by owner"
on public.hinge_events for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.hinges h
    where h.id = hinge_id and h.user_id = auth.uid()
  )
);

-- Owners can update/delete their own events (optional; often not needed)
drop policy if exists "Hinge events updatable by owner" on public.hinge_events;
create policy "Hinge events updatable by owner"
on public.hinge_events for update
using (user_id = auth.uid());

drop policy if exists "Hinge events deletable by owner" on public.hinge_events;
create policy "Hinge events deletable by owner"
on public.hinge_events for delete
using (user_id = auth.uid());
