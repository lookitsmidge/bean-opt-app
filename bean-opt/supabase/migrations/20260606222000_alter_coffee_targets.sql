-- Alter coffee_targets table to support taste_profile column
alter table public.coffee_targets add column if not exists taste_profile text not null default 'Standard';
