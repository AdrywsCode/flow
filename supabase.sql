create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid null references projects(id) on delete set null,
  title text not null,
  description text null,
  status text not null check (status in ('todo','doing','done')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_date date null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at
before update on tasks
for each row execute function set_updated_at();

alter table projects enable row level security;
alter table tasks enable row level security;

create policy "projects_select_own"
  on projects for select
  using (auth.uid() = user_id);

create policy "projects_insert_own"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "projects_update_own"
  on projects for update
  using (auth.uid() = user_id);

create policy "projects_delete_own"
  on projects for delete
  using (auth.uid() = user_id);

create policy "tasks_select_own"
  on tasks for select
  using (auth.uid() = user_id);

create policy "tasks_insert_own"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "tasks_update_own"
  on tasks for update
  using (auth.uid() = user_id);

create policy "tasks_delete_own"
  on tasks for delete
  using (auth.uid() = user_id);
