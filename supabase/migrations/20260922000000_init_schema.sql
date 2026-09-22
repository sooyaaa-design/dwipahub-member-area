-- Initial schema: members, modules, member_access, classes
-- Tier order matters: enum values are compared with < <= > >= based on
-- declaration order below, used to gate module/class access by min_tier.

create type member_tier as enum ('pengantar', 'sertifikasi', 'lanjutan');
create type access_status as enum ('pending', 'active', 'expired', 'revoked');

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- members: one row per authenticated user
create table members (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nama text not null,
  tier member_tier not null default 'pengantar',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger members_set_updated_at
  before update on members
  for each row execute function set_updated_at();

-- modules: content groupings (courses), gated by minimum tier
create table modules (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null,
  min_tier member_tier not null default 'pengantar',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index modules_kategori_idx on modules (kategori);

create trigger modules_set_updated_at
  before update on modules
  for each row execute function set_updated_at();

-- member_access: explicit grant of a member to a module, beyond tier gating
create table member_access (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  module_id uuid not null references modules(id) on delete cascade,
  status access_status not null default 'pending',
  granted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_id, module_id)
);

create index member_access_member_id_idx on member_access (member_id);
create index member_access_module_id_idx on member_access (module_id);

create trigger member_access_set_updated_at
  before update on member_access
  for each row execute function set_updated_at();

-- classes: individual video lessons within a module
create table classes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  judul text not null,
  urutan integer not null,
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, urutan)
);

create index classes_module_id_idx on classes (module_id);

create trigger classes_set_updated_at
  before update on classes
  for each row execute function set_updated_at();

-- Row Level Security

alter table members enable row level security;
alter table modules enable row level security;
alter table member_access enable row level security;
alter table classes enable row level security;

-- members: a member can only see/update their own row
create policy members_select_own on members
  for select using (auth.uid() = id);

create policy members_update_own on members
  for update using (auth.uid() = id);

-- modules: catalog is visible to any authenticated member
create policy modules_select_authenticated on modules
  for select using (auth.role() = 'authenticated');

-- member_access: a member can only see their own access rows
create policy member_access_select_own on member_access
  for select using (member_id = auth.uid());

-- classes: visible if the member's tier meets the module's min_tier,
-- or they hold an explicit active member_access grant for that module
create policy classes_select_if_unlocked on classes
  for select using (
    exists (
      select 1
      from modules m
      join members me on me.id = auth.uid()
      where m.id = classes.module_id
        and me.tier >= m.min_tier
    )
    or exists (
      select 1
      from member_access ma
      where ma.module_id = classes.module_id
        and ma.member_id = auth.uid()
        and ma.status = 'active'
    )
  );
