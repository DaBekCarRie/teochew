# Teochew App — Cowork Project Instructions

คู่มือนี้ให้ Claude เข้าใจภาพรวมของโปรเจกต์ทั้งหมด รวมถึงการเชื่อมต่อกับ Google Drive และ Supabase

---

## ภาพรวมโปรเจกต์

**Teochew** คือ mobile app สำหรับเรียนภาษาแต้จิ๋ว (潮州话) สร้างด้วย React Native + Expo SDK 54
ประกอบด้วย 2 ส่วนหลัก:

1. **Mobile App** — ผู้ใช้ค้นคำศัพท์ ฟังเสียง เรียนรู้ผ่าน 5 tabs
2. **Data Pipeline** — admin เก็บคำศัพท์ + ผู้บันทึกเสียงอัดไฟล์ → upload ขึ้น Supabase

---

## Connections ที่ใช้งานได้

### Google Drive (MCP: `mcp__022f0d35-*`)

ใช้ tools ชุด `mcp__022f0d35-c6c1-4abc-b11c-e89ab6558bb0__*`

| ทรัพยากร                                    | ID / Path                                      |
| ------------------------------------------- | ---------------------------------------------- |
| **Parent folder** (Teochew Drive)           | `1tOsIqH6qX_i1vxB6yu56jY6i5vDu3_CF`            |
| **Recording Sheet** (Google Spreadsheet)    | `16QAaxU7_04-n21WK6CaL58z318w-gH04UHhZLj3Ex0Y` |
| **teochew-audio-raw** (folder รับไฟล์เสียง) | `1fqbxHmmzTU8U4-8TawI5eww0GB3Nj8iq`            |

**Recording Sheet columns:**
`no, filename, teochew_char, teochew_pengim, thai_meaning, english_meaning, category, notes, status, recorder, recorded_date, word_id`

- `no` = ลำดับ 001–200 → ตรงกับชื่อไฟล์เสียง (เช่น `001.m4a`)
- `status`: `⏳ รอ` = ยังไม่ได้อัด, `✅ เสร็จ` = อัดแล้ว
- `word_id` = UUID ใน Supabase `words` table

### Supabase (MCP: `mcp__972fa0a4-*`)

ใช้ tools ชุด `mcp__972fa0a4-8386-4d5b-b54f-b54d03fee652__*`

| ข้อมูล           | ค่า                    |
| ---------------- | ---------------------- |
| **Project ID**   | `vzmvkopnrddlgzkliyvr` |
| **Project name** | TeoChew                |
| **Region**       | ap-southeast-1         |
| **Status**       | ACTIVE_HEALTHY         |

**ตาราง DB หลัก:**

- `public.words` — คำศัพท์ทั้งหมด (id UUID, teochew_char, teochew_pengim, thai_meaning, english_meaning, mandarin_char, category, teochew_audio, verified)
- `public.word_usage_examples` — ตัวอย่างประโยค (word_id → FK to words)

**Storage Bucket:**

- Bucket: `audio` (private, รับ `audio/mpeg` และ `audio/mp4`)
- Path ไฟล์: `<word_uuid>.m4a` หรือ `<word_uuid>.mp3`
- คอลัมน์ `teochew_audio` ใน `words` เก็บ bucket path (ไม่ใช่ full URL) เช่น `a0000001-0000-0000-0000-000000000001.m4a`
- App ดึง signed URL แบบ on-demand ผ่าน `getAudioUrl()`

**Seed UUIDs รูปแบบ:**
`a0000001-0000-0000-0000-000000000001` ถึง `a0000001-0000-0000-0000-000000000200`

---

## Data Collection Workflow

```
1. Admin เพิ่มคำใน Recording Sheet (Google Sheets)
         ↓
2. ผู้บันทึกเสียงดู Sheet → อัดเสียงตาม no (001.m4a, 002.m4a, ...)
         ↓
3. ผู้บันทึกเสียงวางไฟล์ใน Google Drive folder: teochew-audio-raw
   (folder ID: 1fqbxHmmzTU8U4-8TawI5eww0GB3Nj8iq)
         ↓
4. Admin download ไฟล์เสียงจาก Drive มาไว้ใน local folder
         ↓
5. รัน upload script:
   node scripts/upload-audio.js --dir ./audio-files --dry-run   # ทดสอบก่อน
   node scripts/upload-audio.js --dir ./audio-files             # upload จริง
         ↓
6. Script อ่าน recording_sheet.csv → map no → word_id
   → upload ไฟล์ไปที่ Supabase bucket "audio"
   → อัปเดต words.teochew_audio = "<uuid>.m4a"
```

**Script:** `scripts/upload-audio.js`
**Mapping file:** `supabase/seeds/recording_sheet.csv`
**ต้องมีใน `.env.local`:**

```
EXPO_PUBLIC_SUPABASE_URL=https://vzmvkopnrddlgzkliyvr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # ต้องเป็น service role ไม่ใช่ anon key
```

---

## App Architecture

**Stack:** React Native 0.81.5 · React 19 · Expo SDK 54 · Expo Router v6 (file-based routing)

**Entry:** `expo-router/entry` → `src/app/`

**Tabs (5 tabs):**
| Tab | สถานะ |
|---|---|
| Dictionary | ✅ ทำงานแล้ว — ค้นหา, รายละเอียดคำ, bookmarks |
| Learn | 🚧 Placeholder |
| Translate | 🚧 Placeholder |
| Voice | 🚧 Placeholder (เชื่อมเสียงภายหลัง) |
| Culture | 🚧 Placeholder |

**Key directories:**

```
src/
  app/             — Expo Router screens
  components/dictionary/  — UI components
  hooks/           — useWordSearch, useBookmarks, useDebounce
  services/
    supabase/      — client, words.ts, mockWords.ts
    bookmarks.ts   — AsyncStorage CRUD
  types/dictionary.ts
```

**Styling:** NativeWind v4 (Tailwind). Design tokens:

- `cream` — background surfaces
- `gold` — accent / pengim text
- `brown` — text hierarchy
- `brick` — error states

**Mock data:** `USE_MOCK = __DEV__` — ใน development ดึงข้อมูลจาก `mockWords.ts` แทน Supabase

---

## Migrations (ลำดับการ apply)

| ไฟล์                             | เนื้อหา                                                       |
| -------------------------------- | ------------------------------------------------------------- |
| `20240001_words.sql`             | สร้าง words table, usage_examples, indexes, RLS, audio bucket |
| `20240002_words_audio.sql`       | เพิ่มคอลัมน์ `teochew_audio` ใน words                         |
| `20240003_audio_bucket_mime.sql` | อัปเดต bucket ให้รับทั้ง mp3 และ m4a                          |

**Seed data:** `supabase/seeds/words.csv` — 200 คำ พร้อม UUIDs

---

## งานที่ยังค้างอยู่ (Pending)

- [ ] เพิ่ม `SUPABASE_SERVICE_ROLE_KEY` ใน `.env.local` ก่อนรัน upload script ครั้งแรก
- [ ] สร้าง Voice Tab screen ใน app (รับ audio จาก Supabase bucket)
- [ ] พิจารณา QA flow: หลัง upload → admin ฟังเสียง → set `verified = true`

---

## คำสั่งที่ใช้บ่อย

```bash
# Dev server
npm start

# Type check (npx tsc พัง ใช้อันนี้แทน)
node node_modules/typescript/lib/tsc.js --noEmit

# Lint
npx eslint src --ext .ts,.tsx

# Upload audio (dry run)
node scripts/upload-audio.js --dir ./audio-files --dry-run

# Upload audio (จริง)
node scripts/upload-audio.js --dir ./audio-files

# Install packages
npx expo install <package>
# หรือ
npm install <package> --legacy-peer-deps
```

---

## หมายเหตุสำคัญ

- **`npx tsc` พัง** — ใช้ `node node_modules/typescript/lib/tsc.js --noEmit` แทน
- **Metro cache** — รัน `npx expo start --clear` เมื่อเปลี่ยน babel/metro config หรือ install native packages
- **Reanimated v4** — babel plugin ชื่อ `react-native-worklets/plugin` (ไม่ใช่ `react-native-reanimated/plugin`)
- **RLS** — anon key อ่านได้เฉพาะ `verified = true` เท่านั้น; service role key ถึงจะ insert/update/delete ได้
- **Signed URLs** — app ไม่เก็บ full URL ของเสียง แต่เก็บ bucket path แล้วเรียก `getAudioUrl()` ทุกครั้ง
