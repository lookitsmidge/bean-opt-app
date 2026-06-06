-- Drop the old espresso_readings table
drop table if exists public.espresso_readings cascade;

-- Create Coffees Table
create table public.coffees (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete cascade not null,
    name text not null,
    roaster text,
    roast_date date,
    notes text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);
alter table public.coffees enable row level security;

-- Create Coffee Targets Table
create table public.coffee_targets (
    id uuid primary key default gen_random_uuid(),
    coffee_id uuid references public.coffees on delete cascade not null,
    min_yield numeric(4,1),
    max_yield numeric(4,1),
    min_extraction_time numeric(4,1),
    max_extraction_time numeric(4,1),
    min_flow_rate numeric(5,3),
    max_flow_rate numeric(5,3),
    created_at timestamptz not null default now()
);
alter table public.coffee_targets enable row level security;

-- Create Workflows Table
create table public.workflows (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete cascade not null,
    name text not null,
    description text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);
alter table public.workflows enable row level security;

-- Create Workflow Steps Table
create table public.workflow_steps (
    id uuid primary key default gen_random_uuid(),
    workflow_id uuid references public.workflows on delete cascade not null,
    step_number integer not null,
    stage text check (stage in ('Before', 'During', 'After')) not null,
    content text not null,
    important boolean not null default false,
    created_at timestamptz not null default now(),
    unique (workflow_id, step_number)
);
alter table public.workflow_steps enable row level security;

-- Create Coffee Machines Table
create table public.coffee_machines (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete cascade not null,
    name text not null,
    model text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);
alter table public.coffee_machines enable row level security;

-- Create Coffee Grinders Table
create table public.coffee_grinders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete cascade not null,
    name text not null,
    model text,
    active boolean not null default true,
    created_at timestamptz not null default now()
);
alter table public.coffee_grinders enable row level security;

-- Create Coffee Equipments Table (Custom Items)
create table public.coffee_equipments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete cascade not null,
    name text not null,
    type text not null, -- 'Basket', 'Portafilter', 'Shaker', etc.
    active boolean not null default true,
    created_at timestamptz not null default now()
);
alter table public.coffee_equipments enable row level security;

-- Create Setups Table
create table public.setups (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete cascade not null,
    name text not null,
    machine_id uuid references public.coffee_machines on delete set null,
    grinder_id uuid references public.coffee_grinders on delete set null,
    active boolean not null default true,
    created_at timestamptz not null default now()
);
alter table public.setups enable row level security;

-- Create Setup Equipments Junction Table
create table public.setup_equipments (
    setup_id uuid references public.setups on delete cascade not null,
    equipment_id uuid references public.coffee_equipments on delete cascade not null,
    primary key (setup_id, equipment_id)
);
alter table public.setup_equipments enable row level security;

-- Create Redefined Espresso Readings Table
create table public.espresso_readings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete cascade not null,
    coffee_id uuid references public.coffees on delete set null,
    workflow_id uuid references public.workflows on delete set null,
    setup_id uuid references public.setups on delete set null,
    coffee_mass_in numeric(4,1) not null,
    warming_shot boolean not null default false,
    preinfusion_time numeric(4,1) not null default 0.0,
    extraction_time numeric(4,1) not null default 0.0,
    total_yield numeric(4,1) not null,
    flow_rate numeric(5,3) not null,
    flavour_balance integer check (flavour_balance >= 1 and flavour_balance <= 10) not null,
    rating integer check (rating >= 0 and rating <= 5) not null default 0,
    comments text not null default '',
    created_at timestamptz not null default now()
);
alter table public.espresso_readings enable row level security;

-- Create RLS Policies
create policy "Allow owners to manage coffees" on public.coffees for all using (user_id = auth.uid());
create policy "Allow owners to manage workflows" on public.workflows for all using (user_id = auth.uid());
create policy "Allow owners to manage workflow_steps" on public.workflow_steps for all
  using (workflow_id in (select id from public.workflows where user_id = auth.uid()));
create policy "Allow owners to manage coffee_machines" on public.coffee_machines for all using (user_id = auth.uid());
create policy "Allow owners to manage coffee_grinders" on public.coffee_grinders for all using (user_id = auth.uid());
create policy "Allow owners to manage coffee_equipments" on public.coffee_equipments for all using (user_id = auth.uid());
create policy "Allow owners to manage setups" on public.setups for all using (user_id = auth.uid());
create policy "Allow owners to manage setup_equipments" on public.setup_equipments for all
  using (setup_id in (select id from public.setups where user_id = auth.uid()));
create policy "Allow owners to manage coffee_targets" on public.coffee_targets for all
  using (coffee_id in (select id from public.coffees where user_id = auth.uid()));
create policy "Allow owners to manage espresso_readings" on public.espresso_readings for all using (user_id = auth.uid());

-- Create Trigger to Automatically Initialize User Defaults on Profile Creation
create or replace function public.initialize_user_defaults()
returns trigger as $$
declare
    default_coffee_id uuid;
    default_machine_id uuid;
    default_grinder_id uuid;
    default_setup_id uuid;
    default_workflow_id uuid;
begin
    -- Seed Default Coffee
    insert into public.coffees (user_id, name, roaster, notes)
    values (new.id, 'House Blend', 'Default Roaster', 'Sweet & balanced medium roast')
    returning id into default_coffee_id;

    -- Seed Default Machine & Grinder
    insert into public.coffee_machines (user_id, name, model)
    values (new.id, 'Standard Machine', 'Default Model')
    returning id into default_machine_id;

    insert into public.coffee_grinders (user_id, name, model)
    values (new.id, 'Standard Grinder', 'Default Model')
    returning id into default_grinder_id;

    -- Seed Default Setup
    insert into public.setups (user_id, name, machine_id, grinder_id)
    values (new.id, 'My Setup', default_machine_id, default_grinder_id)
    returning id into default_setup_id;

    -- Seed Default Workflow
    insert into public.workflows (user_id, name, description)
    values (new.id, 'Standard Workflow', 'Warming shot, preinfusion, and extraction steps')
    returning id into default_workflow_id;

    -- Seed Workflow Steps
    insert into public.workflow_steps (workflow_id, step_number, stage, content, important) values
    (default_workflow_id, 1, 'Before', 'Run warming flush to heat the group head', false),
    (default_workflow_id, 2, 'Before', 'Grind and distribute coffee evenly in basket', false),
    (default_workflow_id, 3, 'During', 'Preinfuse for 5-10 seconds to wet the puck', true),
    (default_workflow_id, 4, 'During', 'Extract to target yield ratio', false),
    (default_workflow_id, 5, 'After', 'Purge steam wand and knock out puck', false);

    return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists first
drop trigger if exists on_profile_created on public.profiles;

create trigger on_profile_created
    after insert on public.profiles
    for each row execute function public.initialize_user_defaults();
