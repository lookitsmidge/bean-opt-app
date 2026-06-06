-- Alter coffee_targets table to support pre-infusion targets
alter table public.coffee_targets add column if not exists min_preinfusion_time numeric(4,1);
alter table public.coffee_targets add column if not exists max_preinfusion_time numeric(4,1);
