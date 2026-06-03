-- Sprint 5 Phase 1: Polish & Beta Launch Tables
-- 20260603000000_sprint5_tables.sql

-- 1. feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL,
  grandparent_status TEXT,
  message TEXT,
  app_version TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert feedback" 
  ON public.feedback FOR INSERT 
  WITH CHECK (true);
CREATE POLICY "Only admins can view feedback" 
  ON public.feedback FOR SELECT 
  USING (auth.role() = 'service_role'); -- basic restriction for now

-- 2. culture_articles table
CREATE TABLE IF NOT EXISTS public.culture_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('festival', 'food', 'wedding', 'religion', 'tradition')),
  title_th TEXT NOT NULL,
  title_en TEXT,
  cover_image_url TEXT,
  content_th TEXT NOT NULL,
  related_word_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.culture_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view culture articles" 
  ON public.culture_articles FOR SELECT 
  USING (true);

-- 3. word_of_day table
CREATE TABLE IF NOT EXISTS public.word_of_day (
  date DATE PRIMARY KEY,
  word_id UUID NOT NULL REFERENCES public.words(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.word_of_day ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view word of the day" 
  ON public.word_of_day FOR SELECT 
  USING (true);

-- Seed initial data for culture_articles
-- Note: Assuming some dummy words UUIDs aren't strictly checked by array FK constraint in Postgres
INSERT INTO public.culture_articles (category, title_th, title_en, cover_image_url, content_th, related_word_ids)
VALUES
('festival', 'วันตรุษจีน (ก๊วยนี้)', 'Chinese New Year', 'https://images.unsplash.com/photo-1549405626-d352b904d987?w=800&q=80', 'เทศกาลที่สำคัญที่สุดของชาวแต้จิ๋ว มีการไหว้เจ้า ขอพร และการรวมญาติ', ARRAY[]::UUID[]),
('festival', 'วันเช็งเม้ง (เช็งเม้ง)', 'Tomb Sweeping Day', 'https://images.unsplash.com/photo-1582650570390-34d3d82a472a?w=800&q=80', 'ประเพณีการไหว้บรรพบุรุษที่สุสาน แสดงถึงความกตัญญู (ห่าว)', ARRAY[]::UUID[]),
('food', 'ติ่มซำแต้จิ๋ว (เตี้ยมซิม)', 'Teochew Dim Sum', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', 'ขนมจีบ ซาลาเปา ฮะเก๋า ที่มีเอกลักษณ์เฉพาะตัว', ARRAY[]::UUID[]),
('wedding', 'ประเพณีแต่งงาน (ซิงโฮ่ว)', 'Traditional Wedding', 'https://images.unsplash.com/photo-1522856425170-ebda2bb785b9?w=800&q=80', 'การยกน้ำชา (เตี่ยเต๊) และการให้ซองแดงเพื่อความเป็นสิริมงคล', ARRAY[]::UUID[])
ON CONFLICT (id) DO NOTHING;
