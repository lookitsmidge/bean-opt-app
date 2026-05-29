-- Create Espresso Readings Table
create table public.espresso_readings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete cascade not null,
    coffee_mass numeric not null,
    water_mass numeric not null,
    extraction_time numeric not null,
    notes text,
    created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.espresso_readings enable row level security;

-- Policies for owners to manage their own readings
create policy "Allow read access to own readings"
    on public.espresso_readings for select
    to authenticated
    using (user_id = auth.uid());

create policy "Allow insert access to own readings"
    on public.espresso_readings for insert
    to authenticated
    with check (user_id = auth.uid());

create policy "Allow update access to own readings"
    on public.espresso_readings for update
    to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy "Allow delete access to own readings"
    on public.espresso_readings for delete
    to authenticated
    using (user_id = auth.uid());
