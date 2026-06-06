-- Alter coffees table to support roast profile, description, url, and price per kg
alter table public.coffees drop column if exists roast_date;
alter table public.coffees add column if not exists roast_profile text check (roast_profile in ('light', 'medium', 'dark'));
alter table public.coffees add column if not exists description text;
alter table public.coffees add column if not exists url text;
alter table public.coffees add column if not exists price_per_kg numeric(10,2);
