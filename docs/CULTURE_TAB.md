# Culture Tab — เอกสารสรุปสำหรับ UX/UI Designer

> อัปเดตล่าสุด: พฤษภาคม 2026

---

## 1. ภาพรวมและเป้าหมาย

**Culture tab** มีจุดประสงค์เพื่อให้ผู้ใช้ (คนไทยเชื้อสายแต้จิ๋ว / คนที่สนใจวัฒนธรรมจีนแต้จิ๋ว) **ค้นพบและซึมซับวัฒนธรรมแต้จิ๋วในชีวิตประจำวัน** โดยเน้น passive discovery — เปิดแอพแล้วได้เรียนรู้อะไรใหม่ทุกวัน โดยไม่ต้องหาเอง

---

## 2. โครงสร้างหน้า (จากบนลงล่าง)

```
🏮 วัฒนธรรมแต้จิ๋ว  /  Teochew Culture
──────────────────────────────────────
[Festival Countdown Banner]   ← conditional (แสดงเฉพาะมีเทศกาลใน 60 วัน)
│ Section: "ค้นพบวันนี้"
[Word of Day Card]            ← เปลี่ยนทุกวัน (date-seeded)
[Phrase of Day Card]          ← เปลี่ยนทุกวัน (date-seeded)
[Diaspora Origin Card]        ← static, collapsible
──────────────────────────────────────
[เทศกาล & ประเพณี →]         ← horizontal scroll
[อาหารแต้จิ๋ว →]
[พิธีมงคล →]
[ความเชื่อ & ศาสนา →]
[ประเพณีชีวิตประจำวัน →]
```

---

## 3. รายละเอียดแต่ละ Component

### 🎆 Festival Countdown Banner

- **ทริกเกอร์**: แสดงเฉพาะเมื่อมีเทศกาลภายใน 60 วันข้างหน้า
- **ข้อมูล**: ชื่อเทศกาล (ไทย + อักษรจีน + Pengim), emoji, คำอธิบายสั้น, จำนวนวันที่เหลือ
- **Interaction**: ถ้าเทศกาลมีบทความ → กดปุ่ม "ดูบทความ" นำไปหน้า Article
- **Accent color**: แต่ละเทศกาลมีสีประจำตัวเอง (เช่น ตรุษจีน = `#B5451B` แดงอิฐ, ตงจื้อ = `#C9A84C` ทอง)
- **เทศกาลในระบบ** (8 เทศกาล/ปี):

| เทศกาล             | เดือน             | Accent              |
| ------------------ | ----------------- | ------------------- |
| เช็งเม้ง 清明      | เมษายน            | `#5A8A4A` เขียว     |
| เทศกาลบะจ่าง 端午  | มิถุนายน          | `#2D7A4A` เขียวเข้ม |
| วันสารทจีน 中元    | สิงหาคม           | `#6B4C2A` น้ำตาล    |
| ไหว้พระจันทร์ 中秋 | ตุลาคม            | `#9A7A2E` ทองเข้ม   |
| เทศกาลกินเจ 九皇   | ตุลาคม            | `#B5451B` แดงอิฐ    |
| ตงจื้อ 冬至        | ธันวาคม           | `#C9A84C` ทอง       |
| ตรุษจีน 春節       | มกราคม/กุมภาพันธ์ | `#B5451B` แดงอิฐ    |
| หยวนเซียว 元宵     | กุมภาพันธ์        | `#C9A84C` ทอง       |

---

### 📖 Word of Day Card

- **Content**: คำแต้จิ๋ว 1 คำ/วัน — อักษรแต้จิ๋ว (hero 76px), Pengim (italic gold), meaning chips 🇹🇭 🇨🇳 🇬🇧
- **Interaction**:
  - ปุ่ม **"ฟังเสียง"** — เล่น audio (brick button)
  - ปุ่ม **"บันทึกคำ"** — toggle bookmark (gold outline → gold filled)
- **เปลี่ยนคำ**: อัตโนมัติทุกวัน ใช้ date seed แบบ deterministic (วันเดียวกัน = คำเดียวกันทุกคน)
- **Top accent bar**: `#B5451B` (แดงอิฐ)

---

### 💬 Phrase of Day Card

- **Content**: วลี/สำนวนแต้จิ๋ว 1 วลี/วัน — อักษรจีน (hero 52px), Pengim italic gold, ความหมาย 🇹🇭 + 🇬🇧, กล่อง context
- **Category badge** (5 ประเภท):

| Category             | Icon | Color                  |
| -------------------- | ---- | ---------------------- |
| greeting — การทักทาย | 👋   | `#2D7A6A` เขียวน้ำทะเล |
| proverb — สำนวน      | 📜   | `#6B4C2A` น้ำตาล       |
| blessing — คำอวยพร   | 🙏   | `#B5451B` แดงอิฐ       |
| food — อาหาร         | 🍜   | `#9A7A2E` ทองเข้ม      |
| family — ครอบครัว    | 🏠   | `#4A6A9A` น้ำเงิน      |

- **Left accent bar**: สีตาม category
- **ไม่มีปุ่ม audio ในตอนนี้** (field `audio_url` มีใน data model รอ implement)

---

### 🗺️ Diaspora Origin Card

- **Content**: ประวัติการอพยพชาวแต้จิ๋วมาไทย — paragraph สั้น + fact chips (horizontal scroll)
- **Fact chips**:
  - 🗺️ ต้นกำเนิด → 潮汕 กวางตุ้ง
  - 🗓️ อพยพมาไทย → ศตวรรษ 18–19
  - 👥 จำนวนในไทย → ~3.5 ล้านคน
  - 🏙️ ชุมชนหลัก → เยาวราช · จันทบุรี
- **Interaction**: tap header เพื่อ collapse/expand body
- **State เริ่มต้น**: expanded

---

### 📚 Culture Section List

- **โครงสร้าง**: 5 หมวด, แต่ละหมวด scroll แนวนอน
- **หมวด**: 🎆 เทศกาล & ประเพณี / 🍜 อาหารแต้จิ๋ว / 🧧 พิธีมงคล / 🙏 ความเชื่อ & ศาสนา / 🥢 ประเพณีชีวิตประจำวัน
- **Article Card**: รูปปก 176×120px + ชื่อภาษาไทย + ชื่อภาษาอังกฤษ (optional)
- **กดแล้ว**: ไปหน้า Article detail

---

### 📄 Article Detail Screen

- **Layout**: รูปปก full-width (240px) → ชื่อบทความ → เนื้อหาภาษาไทย → คำศัพท์ที่เกี่ยวข้อง
- **Nav**: back button + title "บทความ"
- **หมายเหตุ**: section "คำศัพท์ที่เกี่ยวข้อง" ยังไม่ได้ implement

---

## 4. Design Theme

### Color Palette

| ชื่อ            | Hex       | ใช้กับ                                                      |
| --------------- | --------- | ----------------------------------------------------------- |
| **Gold**        | `#C9A84C` | Accent หลัก, pengim text, border active, section accent bar |
| **Brick**       | `#B5451B` | WordOfDay bar, badge, primary button, เทศกาลใหญ่            |
| **Cream BG**    | `#FAF6EE` | Background หน้าจอ                                           |
| **White Card**  | `#FFFFFF` | Surface ของการ์ดทุกใบ                                       |
| **Inner BG**    | `#FDFAF5` | Hero character background box                               |
| **Dark Brown**  | `#2C1A0E` | Primary text, hero characters                               |
| **Mid Brown**   | `#6B4C2A` | Body text, context text                                     |
| **Muted Brown** | `#A08060` | Secondary text, date, subtitle                              |
| **Divider**     | `#EDE0C4` | เส้นแบ่ง, border อ่อน                                       |

### Typography

| ระดับ             | ขนาด                | Weight     | ใช้กับ                     |
| ----------------- | ------------------- | ---------- | -------------------------- |
| Hero Character    | 52–76px             | 800        | คำแต้จิ๋ว/จีน ใน card หลัก |
| Page Title        | 22px                | 800        | Header ชื่อ tab            |
| Section Title     | 15–16px             | 700–800    | หัวข้อ section             |
| Card Title        | 14–17px             | 700–800    | ชื่อบทความ, ชื่อเทศกาล     |
| Pengim            | 17–22px             | 500 italic | การออกเสียง (สี gold)      |
| Body Text         | 13–14px             | 400–600    | เนื้อหา, context           |
| Caption           | 11–12px             | 600        | Badge text, label, date    |
| **Font**: Sarabun | ทุก Thai/Latin text | —          | —                          |

### Card Pattern

การ์ดทุกใบใช้ pattern เดียวกัน:

```
background:   #FFFFFF
borderRadius: 16–20px
shadow:       color #2C1A0E, opacity 0.08–0.12, radius 12–16
```

### Accent Bar Pattern

- **Section header**: gold bar ซ้าย — `width: 4px`, `height: 18px`, `borderRadius: 2`, `color: #C9A84C`
- **Card top bar**: บาร์บน 4–5px — สีแตกต่างตาม context (brick สำหรับ WordOfDay, เทศกาลใช้สีของตัวเอง)

---

## 5. State & Data Flow

```
cultureStore (Zustand + AsyncStorage)
├── wordOfDay       → WordOfDayCard        (date-seeded, เปลี่ยนทุกวัน)
├── phraseOfDay     → PhraseOfDayCard      (date-seeded + offset 7, เปลี่ยนทุกวัน)
└── articles[]      → CultureSectionList   (mock data)

mockFestivals.ts    → FestivalCountdownBanner
  └── getNextFestival(today, windowDays=60) → FestivalEvent | null

DiasporaOriginCard  → static (ไม่มี store)

Push Notification:  scheduleDailyNotification(time, enabled)
  └── ส่ง "คำแต้จิ๋วประจำวัน" ตามเวลาที่ user ตั้งใน Settings
```

---

## 6. File Structure

```
src/
├── app/(tabs)/culture/
│   ├── index.tsx          ← Main screen (ScrollView ประกอบ component)
│   ├── [id].tsx           ← Article detail screen
│   └── _layout.tsx
├── components/culture/
│   ├── FestivalCountdownBanner.tsx
│   ├── WordOfDayCard.tsx
│   ├── PhraseOfDayCard.tsx
│   ├── DiasporaOriginCard.tsx
│   └── CultureSectionList.tsx
├── data/
│   ├── mockFestivals.ts   ← FestivalEvent[], getNextFestival(), getDaysUntilFestival()
│   └── mockPhrases.ts     ← TeochewPhrase[] (23 วลี)
└── stores/
    └── cultureStore.ts    ← wordOfDay, phraseOfDay, articles, hydrate(), scheduleDailyNotification()
```

---

## 7. จุดที่รอ UX/UI ขยายต่อ

| จุด                      | สถานะปัจจุบัน                 | ขยายได้เป็น                                                  |
| ------------------------ | ----------------------------- | ------------------------------------------------------------ |
| **Article Detail**       | minimal (รูป + text เท่านั้น) | Rich layout: section divider, pull-quote, related word cards |
| **"ดูทั้งหมด →"**        | ปุ่มมีอยู่แต่ยังไม่ link      | หน้า list บทความแต่ละ category                               |
| **Audio ใน PhraseOfDay** | `audio_url` field มีใน model  | ปุ่ม play เหมือน WordOfDayCard                               |
| **Diaspora Origin**      | static text + fact chips      | Interactive timeline หรือ map                                |
| **Festival detail**      | banner link ไป article        | หน้า Festival detail เฉพาะ (gallery, ประเพณี, อาหาร)         |
| **คำศัพท์ใน Article**    | section ว่าง                  | WordEntry cards จาก dictionary                               |
| **Search/Filter**        | ไม่มีใน culture tab           | ค้นหาบทความ, filter by category                              |
| **Bookmark Article**     | ไม่มี                         | บันทึกบทความเหมือน bookmark คำศัพท์                          |
