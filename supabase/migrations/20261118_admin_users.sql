-- ============================================================
-- Admin accounts: an Owner (John) and optional Developers, each with
-- their own sign in. Replaces the single shared Admin password.
--
-- Only the server (service role) reads or writes these tables: row
-- level security is on with no policies, so the public anon key can
-- never see them.
--
-- Passwords are stored only as scrypt hashes. Reset and invitation
-- tokens are stored only as SHA-256 hashes, expire, and are single use.
-- Nothing here ever holds a plain password or a usable token.
-- ============================================================

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  role text not null check (role in ('owner', 'developer')),
  status text not null default 'invited' check (status in ('invited', 'active', 'revoked')),
  password_hash text,
  -- Raised whenever the password changes or access is revoked, which
  -- ends every session signed with the old value
  session_version integer not null default 1,
  invited_by uuid references public.admin_users(id) on delete set null,
  last_login_at timestamptz,
  password_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_email_lower check (email = lower(email))
);
create unique index if not exists admin_users_email_key on public.admin_users (email);

create table if not exists public.admin_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.admin_users(id) on delete cascade,
  purpose text not null check (purpose in ('reset', 'invite')),
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists admin_tokens_user_idx on public.admin_tokens (user_id, purpose);

-- Failed sign ins and reset requests, for rate limiting. Keys are
-- SHA-256 hashes of an IP address or email, never the raw value.
create table if not exists public.admin_auth_attempts (
  id bigint generated always as identity primary key,
  kind text not null,
  key_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists admin_auth_attempts_lookup on public.admin_auth_attempts (kind, key_hash, created_at);

-- Access history shown under Users & Access. Never holds a password or token.
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  actor_id uuid references public.admin_users(id) on delete set null,
  actor_email text,
  action text not null,
  target_email text
);
create index if not exists admin_audit_log_created on public.admin_audit_log (created_at desc);

alter table public.admin_users enable row level security;
alter table public.admin_tokens enable row level security;
alter table public.admin_auth_attempts enable row level security;
alter table public.admin_audit_log enable row level security;

-- There must always be at least one active Owner. Enforced in the
-- database as well as the app, so no code path can remove the last one.
create or replace function public.admin_users_keep_an_owner() returns trigger
language plpgsql set search_path = public as $$
begin
  if old.role = 'owner' and old.status = 'active' and (
    tg_op = 'DELETE' or new.role <> 'owner' or new.status <> 'active'
  ) then
    if not exists (
      select 1 from public.admin_users
      where role = 'owner' and status = 'active' and id <> old.id
    ) then
      raise exception 'There must always be at least one active Owner';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists admin_users_keep_an_owner on public.admin_users;
create trigger admin_users_keep_an_owner
  before update or delete on public.admin_users
  for each row execute function public.admin_users_keep_an_owner();

-- The existing Admin becomes John's Owner account. It has no password
-- hash yet: the first successful sign in with the current Admin password
-- stores it as a hash, or John sets his own with Forgot password.
insert into public.admin_users (email, name, role, status)
values ('john@mccrackencoaching.com', 'John McCracken', 'owner', 'active')
on conflict (email) do nothing;
