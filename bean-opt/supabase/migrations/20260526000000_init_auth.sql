-- 1. Create App Roles Table
create table public.app_roles (
    id bigint generated always as identity primary key,
    role_name text not null unique,
    created_at timestamptz default now()
);

-- Seed Roles
insert into public.app_roles (role_name) values
('admin'),
('moderator'),
('seller'),
('collector');

-- 2. Create User Profiles Table (extends auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique check (username ~* '^[a-zA-Z0-9_]{3,15}$'),
    full_name text,
    avatar_url text,
    bio text,
    is_banned boolean not null default false,
    privacy_policy_accepted_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 3. Create User Roles Junction Table
create table public.user_roles (
    id bigint generated always as identity primary key,
    user_id uuid references public.profiles on delete cascade not null,
    role_id bigint references public.app_roles on delete cascade not null,
    created_at timestamptz default now(),
    unique (user_id, role_id)
);

-- 4. Enable Row Level Security (RLS) on all tables by default
alter table public.app_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- 5. Create helper functions for RLS checks
create or replace function public.authorize(requested_role text)
returns boolean as $$
begin
  return coalesce(
    (auth.jwt() -> 'app_metadata' -> 'roles') ? requested_role,
    false
  );
end;
$$ language plpgsql stable security definer set search_path = public, auth;

create or replace function public.is_admin()
returns boolean as $$
begin
  return public.authorize('admin');
end;
$$ language plpgsql stable security definer set search_path = public, auth;

create or replace function public.is_moderator()
returns boolean as $$
begin
  return public.authorize('moderator') or public.authorize('admin');
end;
$$ language plpgsql stable security definer set search_path = public, auth;

-- 6. Define RLS Policies

-- Public app_roles Policies
create policy "Allow read access to app_roles for authenticated users"
    on public.app_roles for select
    to authenticated
    using (true);

create policy "Allow write access to app_roles for admins only"
    on public.app_roles for all
    to authenticated
    using (public.is_admin());

-- Public profiles Policies
create policy "Allow all access to profiles for owners and admins"
    on public.profiles for all
    to authenticated
    using (id = auth.uid() or public.is_admin());

-- Public user_roles Policies
create policy "Allow read access to user_roles for authenticated users"
    on public.user_roles for select
    to authenticated
    using (true);

create policy "Allow write access to user_roles for admins only"
    on public.user_roles for all
    to authenticated
    using (public.is_admin());

-- 7. Trigger to auto-create profile on new user signup
create or replace function public.handle_new_user_signup()
returns trigger as $$
declare
    calculated_username text;
begin
    -- Extract username from metadata or email prefix
    calculated_username := coalesce(
        new.raw_user_meta_data->>'username',
        substring(new.email from '^[^@]+')
    );
    
    -- Ensure username matches pattern, fallback if needed
    if calculated_username is null or not (calculated_username ~* '^[a-zA-Z0-9_]{3,15}$') then
        calculated_username := 'user_' || substring(md5(random()::text) from 1 for 8);
    end if;

    -- Handle duplicate username resolving (append random string if taken)
    if exists (select 1 from public.profiles where username = calculated_username) then
        calculated_username := calculated_username || substring(md5(random()::text) from 1 for 4);
    end if;

    insert into public.profiles (
        id,
        full_name,
        username,
        avatar_url,
        privacy_policy_accepted_at
    ) values (
        new.id,
        coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', ''),
        calculated_username,
        new.raw_user_meta_data->>'avatar_url',
        case when new.raw_user_meta_data->>'privacy_policy_accepted' = 'true' then now() else null end
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user_signup();

-- 8. Trigger to synchronize roles to auth.users.raw_app_meta_data for join-free RLS checks
create or replace function public.sync_user_roles_to_app_metadata()
returns trigger as $$
declare
    target_user_id uuid;
    role_list jsonb;
begin
    if tg_op = 'DELETE' then
        target_user_id := old.user_id;
    else
        target_user_id := new.user_id;
    end if;

    -- Aggregate roles list
    select jsonb_agg(r.role_name)
    into role_list
    from public.user_roles ur
    join public.app_roles r on ur.role_id = r.id
    where ur.user_id = target_user_id;

    if role_list is null then
        role_list := '[]'::jsonb;
    end if;

    -- Sync roles to GoTrue auth users app_metadata
    update auth.users
    set raw_app_meta_data = jsonb_set(
        coalesce(raw_app_meta_data, '{}'::jsonb),
        '{roles}',
        role_list
    )
    where id = target_user_id;

    return null;
end;
$$ language plpgsql security definer;

create trigger trigger_sync_user_roles
    after insert or update or delete on public.user_roles
    for each row execute function public.sync_user_roles_to_app_metadata();

-- 9. RPC to delete user accounts permanently (client self-delete + admin delete)
create or replace function public.delete_user_permanently(target_user_id uuid)
returns void as $$
begin
    -- Check if caller is admin OR deleting their own account
    if not (public.is_admin() or auth.uid() = target_user_id) then
        raise exception 'Unauthorized: Access denied.';
    end if;

    delete from auth.users where id = target_user_id;
end;
$$ language plpgsql security definer set search_path = public;
