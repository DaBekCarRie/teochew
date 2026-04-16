import type { WordEntry, WordDetail } from '../../types/dictionary';

export const MOCK_WORDS: WordEntry[] = [
  {
    id: 'mock-001',
    teochew_char: '水',
    teochew_pengim: 'zuì',
    thai_meaning: 'น้ำ',
    english_meaning: 'water',
    mandarin_char: '水',
    mandarin_pinyin: 'shuǐ',
    category: 'ธรรมชาติ',
    verified: true,
  },
  {
    id: 'mock-002',
    teochew_char: '火',
    teochew_pengim: 'huè',
    thai_meaning: 'ไฟ',
    english_meaning: 'fire',
    mandarin_char: '火',
    mandarin_pinyin: 'huǒ',
    category: 'ธรรมชาติ',
    verified: true,
  },
  {
    id: 'mock-003',
    teochew_char: '人',
    teochew_pengim: 'nang',
    thai_meaning: 'คน / มนุษย์',
    english_meaning: 'person / human',
    mandarin_char: '人',
    mandarin_pinyin: 'rén',
    category: 'ครอบครัว',
    verified: true,
  },
  {
    id: 'mock-004',
    teochew_char: '食',
    teochew_pengim: 'ziah',
    thai_meaning: 'กิน / รับประทาน',
    english_meaning: 'eat',
    mandarin_char: '食',
    mandarin_pinyin: 'shí',
    category: 'อาหาร',
    verified: true,
  },
  {
    id: 'mock-005',
    teochew_char: '飯',
    teochew_pengim: 'bung',
    thai_meaning: 'ข้าว',
    english_meaning: 'rice / meal',
    mandarin_char: '饭',
    mandarin_pinyin: 'fàn',
    category: 'อาหาร',
    verified: true,
  },
  {
    id: 'mock-006',
    teochew_char: '魚',
    teochew_pengim: 'hǔ',
    thai_meaning: 'ปลา',
    english_meaning: 'fish',
    mandarin_char: '鱼',
    mandarin_pinyin: 'yú',
    category: 'อาหาร',
    verified: true,
  },
  {
    id: 'mock-007',
    teochew_char: '豬',
    teochew_pengim: 'di',
    thai_meaning: 'หมู',
    english_meaning: 'pig / pork',
    mandarin_char: '猪',
    mandarin_pinyin: 'zhū',
    category: 'อาหาร',
    verified: false,
  },
  {
    id: 'mock-008',
    teochew_char: '阿爸',
    teochew_pengim: 'a-bê',
    thai_meaning: 'พ่อ',
    english_meaning: 'father',
    mandarin_char: '爸爸',
    mandarin_pinyin: 'bàba',
    category: 'ครอบครัว',
    verified: true,
  },
  {
    id: 'mock-009',
    teochew_char: '阿母',
    teochew_pengim: 'a-bó',
    thai_meaning: 'แม่',
    english_meaning: 'mother',
    mandarin_char: '妈妈',
    mandarin_pinyin: 'māma',
    category: 'ครอบครัว',
    verified: true,
  },
  {
    id: 'mock-010',
    teochew_char: '好',
    teochew_pengim: 'hó',
    thai_meaning: 'ดี',
    english_meaning: 'good',
    mandarin_char: '好',
    mandarin_pinyin: 'hǎo',
    category: 'คำทั่วไป',
    verified: true,
  },
  {
    id: 'mock-011',
    teochew_char: '無',
    teochew_pengim: 'bô',
    thai_meaning: 'ไม่มี',
    english_meaning: 'none / not have',
    mandarin_char: '无',
    mandarin_pinyin: 'wú',
    category: 'คำทั่วไป',
    verified: true,
  },
  {
    id: 'mock-012',
    teochew_char: '大',
    teochew_pengim: 'duā',
    thai_meaning: 'ใหญ่',
    english_meaning: 'big / large',
    mandarin_char: '大',
    mandarin_pinyin: 'dà',
    category: 'คำทั่วไป',
    verified: true,
  },
  {
    id: 'mock-013',
    teochew_char: '細',
    teochew_pengim: 'sòi',
    thai_meaning: 'เล็ก',
    english_meaning: 'small / little',
    mandarin_char: '小',
    mandarin_pinyin: 'xiǎo',
    category: 'คำทั่วไป',
    verified: true,
  },
  {
    id: 'mock-014',
    teochew_char: '錢',
    teochew_pengim: 'zîⁿ',
    thai_meaning: 'เงิน',
    english_meaning: 'money',
    mandarin_char: '钱',
    mandarin_pinyin: 'qián',
    category: 'คำทั่วไป',
    verified: true,
  },
  {
    id: 'mock-015',
    teochew_char: '狗',
    teochew_pengim: 'gáu',
    thai_meaning: 'หมา / สุนัข',
    english_meaning: 'dog',
    mandarin_char: '狗',
    mandarin_pinyin: 'gǒu',
    category: 'สัตว์',
    verified: true,
  },
  {
    id: 'mock-016',
    teochew_char: '貓',
    teochew_pengim: 'niāu',
    thai_meaning: 'แมว',
    english_meaning: 'cat',
    mandarin_char: '猫',
    mandarin_pinyin: 'māo',
    category: 'สัตว์',
    verified: true,
  },
  {
    id: 'mock-017',
    teochew_char: '日',
    teochew_pengim: 'rìg',
    thai_meaning: 'วัน / ดวงอาทิตย์',
    english_meaning: 'day / sun',
    mandarin_char: '日',
    mandarin_pinyin: 'rì',
    category: 'ธรรมชาติ',
    verified: true,
  },
  {
    id: 'mock-018',
    teochew_char: '月',
    teochew_pengim: 'ghueh',
    thai_meaning: 'เดือน / ดวงจันทร์',
    english_meaning: 'month / moon',
    mandarin_char: '月',
    mandarin_pinyin: 'yuè',
    category: 'ธรรมชาติ',
    verified: true,
  },
  {
    id: 'mock-019',
    teochew_char: '茶',
    teochew_pengim: 'tê',
    thai_meaning: 'ชา',
    english_meaning: 'tea',
    mandarin_char: '茶',
    mandarin_pinyin: 'chá',
    category: 'อาหาร',
    verified: true,
  },
  {
    id: 'mock-020',
    teochew_char: '汝',
    teochew_pengim: 'lì',
    thai_meaning: 'คุณ / เธอ',
    english_meaning: 'you',
    mandarin_char: '你',
    mandarin_pinyin: 'nǐ',
    category: 'คำทั่วไป',
    verified: true,
  },
];

const FIELDS: (keyof WordEntry)[] = [
  'teochew_char',
  'teochew_pengim',
  'thai_meaning',
  'english_meaning',
  'mandarin_char',
  'mandarin_pinyin',
];

export const MOCK_WORD_DETAILS: Record<string, WordDetail> = {
  'mock-001': {
    ...MOCK_WORDS[0],
    notes: 'คำนี้ออกเสียงเหมือนเสียงน้ำไหล ใช้ได้ทั้งนามและกริยา',
    usage_examples: [
      {
        teochew_char: '我要食水',
        teochew_pengim: 'ua-beh-ziah-zuì',
        thai_meaning: 'ฉันอยากดื่มน้ำ',
        english_meaning: 'I want to drink water',
      },
      {
        teochew_char: '水真清',
        teochew_pengim: 'zuì-zin-ceng',
        thai_meaning: 'น้ำใสมาก',
        english_meaning: 'The water is very clear',
      },
    ],
  },
  'mock-002': {
    ...MOCK_WORDS[1],
    notes: 'ใช้เปรียบเทียบความโกรธ เช่น "ใจไฟ" (ใจร้อน)',
    usage_examples: [
      {
        teochew_char: '火真大',
        teochew_pengim: 'huè-zin-duā',
        thai_meaning: 'ไฟใหญ่มาก',
        english_meaning: 'The fire is very big',
      },
      {
        teochew_char: '无火',
        teochew_pengim: 'bô-huè',
        thai_meaning: 'ไม่มีไฟ',
        english_meaning: 'No fire',
      },
    ],
  },
  'mock-003': {
    ...MOCK_WORDS[2],
    notes: 'ใช้เรียกคนทั่วไป หรือใช้ต่อท้ายเพื่อบอกอาชีพ เช่น 生理人 (นักธุรกิจ)',
    usage_examples: [
      {
        teochew_char: '伊是好人',
        teochew_pengim: 'i-si-hó-nang',
        thai_meaning: 'เขาเป็นคนดี',
        english_meaning: 'He is a good person',
      },
      {
        teochew_char: '人真多',
        teochew_pengim: 'nang-zin-zoi',
        thai_meaning: 'มีคนเยอะมาก',
        english_meaning: 'There are many people',
      },
    ],
  },
  'mock-004': {
    ...MOCK_WORDS[3],
    notes: 'ใช้เป็นกริยา "กิน" ทั้งอาหารและเครื่องดื่ม ต่างจากภาษาจีนกลางที่แยก 吃 กับ 喝',
    usage_examples: [
      {
        teochew_char: '汝食饱未？',
        teochew_pengim: 'lì-ziah-bá-buê',
        thai_meaning: 'คุณกินข้าวหรือยัง?',
        english_meaning: 'Have you eaten yet?',
      },
      {
        teochew_char: '食茶',
        teochew_pengim: 'ziah-tê',
        thai_meaning: 'ดื่มชา',
        english_meaning: 'Drink tea',
      },
    ],
  },
  'mock-005': {
    ...MOCK_WORDS[4],
    notes: 'คำทักทายที่นิยมใช้คือ "食饭未？" แปลว่า "กินข้าวหรือยัง?" ซึ่งหมายถึงการทักทายทั่วไป',
    usage_examples: [
      {
        teochew_char: '食饭未？',
        teochew_pengim: 'ziah-bung-buê',
        thai_meaning: 'กินข้าวหรือยัง?',
        english_meaning: 'Have you eaten yet?',
      },
      {
        teochew_char: '饭真好食',
        teochew_pengim: 'bung-zin-hó-ziah',
        thai_meaning: 'ข้าวอร่อยมาก',
        english_meaning: 'The rice is very tasty',
      },
    ],
  },
  'mock-006': {
    ...MOCK_WORDS[5],
    notes: 'ปลาเป็นอาหารสำคัญของชาวแต้จิ๋วที่อยู่ริมทะเล มีคำศัพท์ปลาหลายชนิด',
    usage_examples: [
      {
        teochew_char: '食鱼',
        teochew_pengim: 'ziah-hǔ',
        thai_meaning: 'กินปลา',
        english_meaning: 'Eat fish',
      },
      {
        teochew_char: '鱼真鲜',
        teochew_pengim: 'hǔ-zin-cian',
        thai_meaning: 'ปลาสดมาก',
        english_meaning: 'The fish is very fresh',
      },
    ],
  },
  'mock-007': {
    ...MOCK_WORDS[6],
    notes: 'หมูย่างเป็นอาหารสำคัญในพิธีกรรมของชาวแต้จิ๋ว',
    usage_examples: [
      {
        teochew_char: '豬肉',
        teochew_pengim: 'di-nêg',
        thai_meaning: 'เนื้อหมู',
        english_meaning: 'Pork',
      },
      {
        teochew_char: '一只豬',
        teochew_pengim: 'zêg-zêg-di',
        thai_meaning: 'หมูตัวหนึ่ง',
        english_meaning: 'One pig',
      },
    ],
  },
  'mock-008': {
    ...MOCK_WORDS[7],
    notes: '"阿" เป็นคำนำหน้าที่ใช้กับคำเรียกญาติหรือชื่อเล่น แสดงความใกล้ชิด',
    usage_examples: [
      {
        teochew_char: '阿爸来了',
        teochew_pengim: 'a-bê-lāi-loh',
        thai_meaning: 'พ่อมาแล้ว',
        english_meaning: 'Father has arrived',
      },
      {
        teochew_char: '我阿爸真好',
        teochew_pengim: 'ua-a-bê-zin-hó',
        thai_meaning: 'พ่อของฉันดีมาก',
        english_meaning: 'My father is very kind',
      },
    ],
  },
  'mock-009': {
    ...MOCK_WORDS[8],
    notes: '"阿母" บางพื้นที่อาจออกเสียง "阿妈" (a-má) ในสำเนียงต่างกัน',
    usage_examples: [
      {
        teochew_char: '阿母，我转来了',
        teochew_pengim: 'a-bó-ua-ting-lāi-loh',
        thai_meaning: 'แม่ ฉันกลับมาแล้ว',
        english_meaning: "Mom, I'm back",
      },
      {
        teochew_char: '阿母煮饭',
        teochew_pengim: 'a-bó-zú-bung',
        thai_meaning: 'แม่หุงข้าว',
        english_meaning: 'Mother is cooking rice',
      },
    ],
  },
  'mock-010': {
    ...MOCK_WORDS[9],
    notes: '"好" ออกเสียงสูง (เสียงตรี) ใช้ตอบรับ แสดงความยินยอม หรือชมเชย',
    usage_examples: [
      {
        teochew_char: '好，我知矣',
        teochew_pengim: 'hó-ua-zai-ê',
        thai_meaning: 'โอเค ฉันรู้แล้ว',
        english_meaning: 'Okay, I understand',
      },
      {
        teochew_char: '真好！',
        teochew_pengim: 'zin-hó',
        thai_meaning: 'ดีมาก!',
        english_meaning: 'Very good!',
      },
    ],
  },
  'mock-011': {
    ...MOCK_WORDS[10],
    notes: '"無" ใช้แทน "ไม่มี" และยังใช้เป็นคำถามท้ายประโยคได้ เช่น "...無？" (มีไหม? / ใช่ไหม?)',
    usage_examples: [
      {
        teochew_char: '伊無来',
        teochew_pengim: 'i-bô-lāi',
        thai_meaning: 'เขาไม่ได้มา',
        english_meaning: 'He did not come',
      },
      {
        teochew_char: '钱无矣',
        teochew_pengim: 'zîⁿ-bô-ê',
        thai_meaning: 'เงินหมดแล้ว',
        english_meaning: 'Money is gone',
      },
    ],
  },
  'mock-012': {
    ...MOCK_WORDS[11],
    notes: '"大" มีเสียงวรรณยุกต์ต่างกันเมื่อใช้กับความหมายต่าง ๆ',
    usage_examples: [
      {
        teochew_char: '大人',
        teochew_pengim: 'duā-nang',
        thai_meaning: 'ผู้ใหญ่',
        english_meaning: 'Adult',
      },
      {
        teochew_char: '伊真大',
        teochew_pengim: 'i-zin-duā',
        thai_meaning: 'มันใหญ่มาก',
        english_meaning: 'It is very big',
      },
    ],
  },
  'mock-013': {
    ...MOCK_WORDS[12],
    notes: '"細" ในแต้จิ๋วหมายถึงทั้ง "เล็ก" และ "น้อย" ต่างจากภาษาจีนกลางที่ใช้ 小',
    usage_examples: [
      {
        teochew_char: '细囝',
        teochew_pengim: 'sòi-kiáⁿ',
        thai_meaning: 'เด็กเล็ก',
        english_meaning: 'Young child',
      },
      {
        teochew_char: '真细',
        teochew_pengim: 'zin-sòi',
        thai_meaning: 'เล็กมาก',
        english_meaning: 'Very small',
      },
    ],
  },
  'mock-014': {
    ...MOCK_WORDS[13],
    notes: 'ชาวแต้จิ๋วมีชื่อเสียงด้านการค้า คำว่า 錢 จึงปรากฏในสำนวนมากมาย',
    usage_examples: [
      {
        teochew_char: '有钱',
        teochew_pengim: 'ū-zîⁿ',
        thai_meaning: 'มีเงิน / รวย',
        english_meaning: 'Have money / rich',
      },
      {
        teochew_char: '无钱',
        teochew_pengim: 'bô-zîⁿ',
        thai_meaning: 'ไม่มีเงิน / จน',
        english_meaning: 'No money / poor',
      },
    ],
  },
  'mock-015': {
    ...MOCK_WORDS[14],
    notes: 'ออกเสียงคล้ายภาษาไทย "เกา" ซึ่งทำให้จำง่ายสำหรับผู้พูดภาษาไทย',
    usage_examples: [
      {
        teochew_char: '一只狗',
        teochew_pengim: 'zêg-zêg-gáu',
        thai_meaning: 'สุนัขตัวหนึ่ง',
        english_meaning: 'One dog',
      },
      {
        teochew_char: '狗真乖',
        teochew_pengim: 'gáu-zin-guai',
        thai_meaning: 'หมาน่ารักมาก',
        english_meaning: 'The dog is very well-behaved',
      },
    ],
  },
  'mock-016': {
    ...MOCK_WORDS[15],
    notes: '"niāu" เสียงยาวพร้อมวรรณยุกต์สูง จำง่ายเพราะคล้ายเสียงแมวร้อง',
    usage_examples: [
      {
        teochew_char: '一只猫',
        teochew_pengim: 'zêg-zêg-niāu',
        thai_meaning: 'แมวตัวหนึ่ง',
        english_meaning: 'One cat',
      },
      {
        teochew_char: '猫食鱼',
        teochew_pengim: 'niāu-ziah-hǔ',
        thai_meaning: 'แมวกินปลา',
        english_meaning: 'The cat eats fish',
      },
    ],
  },
  'mock-017': {
    ...MOCK_WORDS[16],
    notes: '"日" ใช้ทั้งความหมาย "วัน" และ "ดวงอาทิตย์" เหมือนภาษาจีนกลาง',
    usage_examples: [
      {
        teochew_char: '今日',
        teochew_pengim: 'ging-rìg',
        thai_meaning: 'วันนี้',
        english_meaning: 'Today',
      },
      {
        teochew_char: '日头',
        teochew_pengim: 'rìg-tao',
        thai_meaning: 'ดวงอาทิตย์',
        english_meaning: 'The sun',
      },
    ],
  },
  'mock-018': {
    ...MOCK_WORDS[17],
    notes: '"月" ใช้ทั้ง "เดือน" และ "ดวงจันทร์" เทศกาลไหว้พระจันทร์เรียกว่า 月娘 (ghueh-niô)',
    usage_examples: [
      {
        teochew_char: '这个月',
        teochew_pengim: 'zit-gê-ghueh',
        thai_meaning: 'เดือนนี้',
        english_meaning: 'This month',
      },
      {
        teochew_char: '月娘',
        teochew_pengim: 'ghueh-niô',
        thai_meaning: 'ดวงจันทร์ (เชิงกวี)',
        english_meaning: 'The moon (poetic)',
      },
    ],
  },
  'mock-019': {
    ...MOCK_WORDS[18],
    notes: 'ชาวแต้จิ๋วมีวัฒนธรรมชาโดดเด่น โดยเฉพาะพิธีชงชา "กงฟู่ชา" (工夫茶)',
    usage_examples: [
      {
        teochew_char: '食茶',
        teochew_pengim: 'ziah-tê',
        thai_meaning: 'ดื่มชา',
        english_meaning: 'Drink tea',
      },
      {
        teochew_char: '工夫茶',
        teochew_pengim: 'gang-hu-tê',
        thai_meaning: 'ชากงฟู่ (พิธีชงชาแต้จิ๋ว)',
        english_meaning: 'Gongfu tea ceremony',
      },
    ],
  },
  'mock-020': {
    ...MOCK_WORDS[19],
    notes: '"汝" เป็นสรรพนามบุรุษที่ 2 ทั่วไป ในบางสำเนียงอาจใช้ 你 (lì) แทน',
    usage_examples: [
      {
        teochew_char: '汝好',
        teochew_pengim: 'lì-hó',
        thai_meaning: 'สวัสดี (แก่คุณ)',
        english_meaning: 'Hello (to you)',
      },
      {
        teochew_char: '汝是哪位？',
        teochew_pengim: 'lì-si-nā-ui',
        thai_meaning: 'คุณเป็นใคร?',
        english_meaning: 'Who are you?',
      },
    ],
  },
};

export function getMockWordDetail(id: string): WordDetail | null {
  return MOCK_WORD_DETAILS[id] ?? null;
}

export function searchMockWords(query: string): WordEntry[] {
  const q = query.toLowerCase().trim();
  return MOCK_WORDS.filter((w) =>
    FIELDS.some((field) => {
      const val = w[field];
      return typeof val === 'string' && val.toLowerCase().includes(q);
    }),
  );
}
