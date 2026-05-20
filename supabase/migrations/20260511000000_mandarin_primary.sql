-- Make Mandarin fields primary (NOT NULL)
ALTER TABLE public.words
  ALTER COLUMN mandarin_char SET NOT NULL,
  ALTER COLUMN mandarin_pinyin SET NOT NULL;

-- Make Teochew fields supplementary (nullable)
ALTER TABLE public.words
  ALTER COLUMN teochew_char DROP NOT NULL,
  ALTER COLUMN teochew_pengim DROP NOT NULL;
