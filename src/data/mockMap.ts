export interface MapRegion {
  id: string;
  name_th: string;
  name_zh: string;
  name_tc: string; // Peng'im
  x: number; // percentage from left
  y: number; // percentage from top
  description: string;
  famous_food: string;
}

export const CHAOSHAN_REGIONS: MapRegion[] = [
  {
    id: 'shantou',
    name_th: 'ซัวเถา (Shantou)',
    name_zh: '汕头',
    name_tc: 'Sòaⁿ-thâu',
    x: 55,
    y: 70,
    description:
      'เมืองท่าสำคัญและศูนย์กลางเศรษฐกิจของแต้จิ๋ว เป็นจุดเริ่มต้นที่ชาวจีนโพ้นทะเลจำนวนมากอพยพมายังไทย',
    famous_food: 'ลูกชิ้นเนื้อซัวเถา (汕头牛肉丸)',
  },
  {
    id: 'chaozhou',
    name_th: 'แต้จิ๋ว (Chaozhou)',
    name_zh: '潮州',
    name_tc: 'Tiê-chiu',
    x: 50,
    y: 40,
    description: 'เมืองแห่งประวัติศาสตร์และวัฒนธรรมดั้งเดิม ต้นกำเนิดของงิ้วแต้จิ๋วและชาแต้จิ๋ว',
    famous_food: 'ห่านพะโล้ (卤鹅)',
  },
  {
    id: 'jieyang',
    name_th: 'กิกเอี๊ย (Jieyang)',
    name_zh: '揭阳',
    name_tc: 'Kiat-iông',
    x: 35,
    y: 50,
    description:
      'เมืองที่มีประชากรมากที่สุดในบรรดา 3 เมืองหลักของแต้จิ๋ว (ซัวเถา, แต้จิ๋ว, กิกเอี๊ย)',
    famous_food: 'ก๋วยเตี๋ยวหลอดกิกเอี๊ย (捆粿)',
  },
  {
    id: 'chenghai',
    name_th: 'เท้งไฮ้ (Chenghai)',
    name_zh: '澄海',
    name_tc: 'Thêng-hái',
    x: 70,
    y: 55,
    description:
      'เขตการปกครองที่มีชื่อเสียงด้านอุตสาหกรรมของเล่น และเป็นบ้านเกิดของบรรพบุรุษชาวไทยเชื้อสายจีนหลายตระกูล',
    famous_food: 'ห่านพะโล้หัวสิงโต (狮头鹅)',
  },
  {
    id: 'chaoyang',
    name_th: 'เตี่ยเอี้ย (Chaoyang)',
    name_zh: '潮阳',
    name_tc: 'Tiô-iô',
    x: 45,
    y: 75,
    description: 'เมืองที่มีประวัติศาสตร์ยาวนานกว่าพันปี และมีประชากรหนาแน่น',
    famous_food: 'กุ้งแพทอด (蚝烙 / ออส่วน)',
  },
  {
    id: 'puning',
    name_th: 'เผงอิม (Puning)',
    name_zh: '普宁',
    name_tc: 'Phó͘-lêng',
    x: 25,
    y: 65,
    description: 'ศูนย์กลางตลาดยาสมุนไพรที่ใหญ่ที่สุดแห่งหนึ่ง และเมืองแห่งเสื้อผ้า',
    famous_food: 'เต้าหู้ทอดเผงอิม (普宁炸豆干)',
  },
  {
    id: 'huilai',
    name_th: 'หุยไล้ (Huilai)',
    name_zh: '惠来',
    name_tc: 'Hūi-lâi',
    x: 28,
    y: 85,
    description: 'เมืองชายฝั่งทะเลที่มีความสำคัญทางด้านประมงและพลังงานลม',
    famous_food: 'ลูกชิ้นปลา (鱼丸)',
  },
  {
    id: 'raoping',
    name_th: 'เหยี่ยวเพ้ง (Raoping)',
    name_zh: '饶平',
    name_tc: 'Jiâu-phêng',
    x: 65,
    y: 25,
    description: 'เมืองท่าชายแดนที่ติดกับมณฑลฝูเจี้ยน มีภูมิทัศน์ภูเขาและชายทะเล',
    famous_food: 'หอยนางรม (牡蛎)',
  },
];
