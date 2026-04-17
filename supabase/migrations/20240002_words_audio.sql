-- Add teochew_audio field to words table
alter table public.words add column if not exists teochew_audio text;
