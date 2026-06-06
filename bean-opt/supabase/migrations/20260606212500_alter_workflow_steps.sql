-- Alter workflow_steps table to support title and instructions and remove content
alter table public.workflow_steps drop column if exists content;
alter table public.workflow_steps add column if not exists title text;
alter table public.workflow_steps add column if not exists instructions text;
