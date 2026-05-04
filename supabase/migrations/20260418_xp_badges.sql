-- Migration: S2-8 XP & Badge Reward System
-- Created: 2026-04-18

CREATE TABLE user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, source, reference_id, created_at)
);

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_th TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  condition_key TEXT NOT NULL UNIQUE,
  xp_reward INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  notified BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

-- Row Level Security (RLS)
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own XP" ON user_xp FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own XP transactions" ON xp_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own badges" ON user_badges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Badges readable by all" ON badges FOR SELECT USING (true);

-- Seed static badges
INSERT INTO badges (name_th, name_en, description_th, icon, category, condition_key, xp_reward, sort_order) VALUES
  ('นักเรียนใหม่', 'First Steps', 'เรียนจบบทแรก', '🌱', 'learning', 'first_lesson', 50, 10),
  ('นักเรียนขยัน', 'Diligent Student', 'เรียนจบ 3 บทเรียน', '📚', 'learning', 'three_lessons', 30, 20),
  ('จบหลักสูตร', 'Graduate', 'เรียนจบทุกบทเรียน', '🎓', 'learning', 'all_lessons', 100, 30),
  
  ('ตอบถูกครั้งแรก', 'First Answer', 'ทำ Quiz เป็นครั้งแรก', '✅', 'quiz', 'first_quiz', 10, 40),
  ('เต็มร้อย', 'Perfect Score', 'ทำ Quiz ได้ 100% เป็นครั้งแรก', '💯', 'quiz', 'first_perfect', 30, 50),
  ('เต็มร้อย 3 ครั้ง', 'Triple Perfect', 'ทำ Quiz ได้ 100% จำนวน 3 ครั้ง', '🌟', 'quiz', 'three_perfects', 50, 60),

  ('เริ่มต้นดี', 'Good Start', 'เรียนต่อเนื่อง 7 วัน', '🔥', 'streak', 'streak_7', 20, 70),
  ('สม่ำเสมอ', 'Consistent', 'เรียนต่อเนื่อง 14 วัน', '⭐', 'streak', 'streak_14', 30, 80),
  ('ไม่หยุดเรียน', 'Unstoppable', 'เรียนต่อเนื่อง 30 วัน', '💎', 'streak', 'streak_30', 50, 90),
  ('ตำนาน', 'Legend', 'เรียนต่อเนื่อง 100 วัน', '👑', 'streak', 'streak_100', 100, 100),

  ('จำได้แล้ว', 'Memory Spark', 'คำศัพท์ถึงระดับ mastered 10 คำ', '🧠', 'mastery', 'mastered_10', 20, 110),
  ('คลังคำศัพท์', 'Vocabulary Vault', 'คำศัพท์ถึงระดับ mastered 30 คำ', '📖', 'mastery', 'mastered_30', 30, 120),
  ('พจนานุกรมเดินได้', 'Walking Dictionary', 'คำศัพท์ถึงระดับ mastered 50 คำ', '🏆', 'mastery', 'mastered_50', 50, 130);
