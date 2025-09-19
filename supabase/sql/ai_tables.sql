create table if not exists public.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  status text check (status in ('queued','running','done','error')) default 'queued',
  input jsonb not null,
  result jsonb
);

create table if not exists public.ai_events (
  id bigserial primary key,
  created_at timestamp with time zone default now(),
  task_id uuid references public.ai_tasks(id) on delete cascade,
  message text not null
);
