export interface Folktale {
  id: string;
  title: string;
  description: string;
  content_th: string;
  content_zh: string;
  content_tc: string;
  audio_url: string;
  tags: string[];
  duration: number; // in seconds
}

export const MOCK_FOLKTALES: Folktale[] = [
  {
    id: 'f1',
    title: 'ตำนานชาแต้จิ๋ว (กังฮูเต๊)',
    description: 'เรื่องราวของศิลปะการชงชาที่ชาวแต้จิ๋วสืบทอดกันมา',
    content_zh:
      '潮州工夫茶，是中国茶艺中最具代表性的一种。它不仅是一种饮茶的方式，更是一种生活态度。',
    content_tc:
      'Tiê-chiu kang-hu-tê, sī Tiong-kok tê-gē tiong chòe kū tāi-piáu-sèng ê chi̍t-chióng. I m̄-nā sī chi̍t-chióng lim tê ê hong-sek, koh sī chi̍t-chióng seng-oa̍h thài-tō͘.',
    content_th:
      'กังฮูเต๊ หรือชาแต้จิ๋ว เป็นหนึ่งในศิลปะการชงชาที่โดดเด่นที่สุดของจีน ไม่ใช่แค่วิธีการดื่มชา แต่เป็นถึงทัศนคติในการใช้ชีวิต',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
    tags: ['วัฒนธรรม', 'ชา', 'ระดับกลาง'],
    duration: 124,
  },
  {
    id: 'f2',
    title: 'สุภาษิต: ดื่มน้ำอย่าลืมคนขุดบ่อ',
    description: 'สุภาษิตเตือนใจชาวแต้จิ๋วโพ้นทะเลไม่ให้ลืมรากเหง้า',
    content_zh: '吃水勿忘挖井人',
    content_tc: 'Chia̍h chúi mài bōe-kì iah chéⁿ lâng',
    content_th:
      'ดื่มน้ำอย่าลืมคนขุดบ่อ (รำลึกถึงบุญคุณและรากเหง้าของตนเองเสมอ เมื่อเราได้ดีไม่ควรลืมผู้ที่ช่วยเหลือให้เรามีวันนี้)',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder
    tags: ['สุภาษิต', 'ข้อคิด', 'ระดับง่าย'],
    duration: 15,
  },
  {
    id: 'f3',
    title: 'นิทาน: ปี่เซียะเรียกทรัพย์',
    description: 'ความเชื่อเรื่องสัตว์มงคลที่ช่วยเรียกเงินทองให้ชาวจีนค้าขาย',
    content_zh:
      '貔貅，又名天禄，是中国古代神话传说中的一种神兽，龙头、马身、麟脚，形似狮子。相传它可以招财进宝。',
    content_tc:
      'Phî-hiu, iū bêng thian-lo̍k, sī Tiong-kok kó͘-tāi sîn-ōe thoân-soat tiong ê chi̍t-chióng sîn-siù, lêng-thâu, bé-sin, lîn-kha, hêng sū sai-á. Siong-thoân i thang chio-châi chìn-pó.',
    content_th:
      'ปี่เซียะ หรือที่รู้จักในชื่อ เทียนลก เป็นสัตว์มงคลในตำนานจีนโบราณ มีหัวเป็นมังกร ตัวเป็นม้า ขาเป็นกิเลน รูปร่างคล้ายสิงโต เล่าขานกันว่าสามารถเรียกโชคลาภเงินทองได้',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder
    tags: ['ความเชื่อ', 'ตำนาน', 'ระดับยาก'],
    duration: 45,
  },
];
