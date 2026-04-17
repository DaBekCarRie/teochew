-- Enable trigram extension for efficient ILIKE queries
create extension if not exists pg_trgm;

-- ============================================================
-- words table
-- ============================================================
create table if not exists public.words (
  id              uuid        primary key default gen_random_uuid(),
  teochew_char    text        not null,
  teochew_pengim  text        not null,
  thai_meaning    text        not null,
  english_meaning text        not null,
  mandarin_char   text,
  mandarin_pinyin text,
  category        text,
  verified        boolean     not null default false,
  notes           text,
  created_at      timestamptz not null default now()
);

-- Trigram indexes for fast multi-column ILIKE search
create index if not exists words_teochew_char_idx  on public.words using gin (teochew_char   gin_trgm_ops);
create index if not exists words_pengim_idx        on public.words using gin (teochew_pengim  gin_trgm_ops);
create index if not exists words_thai_idx          on public.words using gin (thai_meaning    gin_trgm_ops);
create index if not exists words_english_idx       on public.words using gin (english_meaning gin_trgm_ops);
create index if not exists words_mandarin_char_idx on public.words using gin (mandarin_char   gin_trgm_ops);
create index if not exists words_mandarin_pinyin_idx on public.words using gin (mandarin_pinyin gin_trgm_ops);

-- RLS: anyone (anon key) can read verified words; only service role can insert/update/delete
alter table public.words enable row level security;

create policy "Public read verified words"
  on public.words for select
  using (verified = true);

-- ============================================================
-- word_usage_examples table
-- ============================================================
create table if not exists public.word_usage_examples (
  id              uuid primary key default gen_random_uuid(),
  word_id         uuid not null references public.words(id) on delete cascade,
  teochew_char    text not null,
  teochew_pengim  text not null,
  thai_meaning    text not null,
  english_meaning text not null,
  sort_order      int  not null default 0
);

alter table public.word_usage_examples enable row level security;

create policy "Public read usage examples"
  on public.word_usage_examples for select
  using (true);

-- ============================================================
-- Storage: audio bucket
-- ============================================================
insert into storage.buckets (id, name, public, allowed_mime_types)
values ('audio', 'audio', false, array['audio/mpeg'])
on conflict (id) do nothing;

create policy "Authenticated users can read audio"
  on storage.objects for select
  using (bucket_id = 'audio' and auth.role() = 'authenticated');
