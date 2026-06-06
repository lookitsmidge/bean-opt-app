-- Alter coffee_machines table to support manufacturer and remove model
alter table public.coffee_machines drop column if exists model;
alter table public.coffee_machines add column if not exists manufacturer text;

-- Alter coffee_grinders table to support manufacturer and remove model
alter table public.coffee_grinders drop column if exists model;
alter table public.coffee_grinders add column if not exists manufacturer text;
