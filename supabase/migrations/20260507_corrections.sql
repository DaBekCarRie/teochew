create table if not exists public.corrections (
  id                     uuid        primary key default gen_random_uuid(),
  mandarin_char          text        not null,
  original_teochew_char  text,
  original_pengim        text,
  suggested_teochew_char text        not null,
  suggested_pengim       text        not null,
  note                   text,
  created_at             timestamptz not null default now()
);

alter table public.corrections enable row level security;

-- Anyone with anon key can submit a correction
create policy "Anyone can submit corrections"
  on public.corrections for insert
  with check (true);
