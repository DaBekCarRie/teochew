interface NotificationTemplate {
  title: string;
  body: (streak: number) => string;
}

export const REMINDER_TEMPLATES: NotificationTemplate[] = [
  {
    title: '🔥 อย่าลืมเรียนแต้จิ๋ววันนี้!',
    body: (streak) => `streak ${streak} วันจะหาย — เรียนสัก 1 รอบ!`,
  },
  {
    title: '📚 เรียนแต้จิ๋ววันนี้กันเถอะ',
    body: (streak) =>
      streak > 0 ? `รักษา streak ${streak} วันไว้นะ!` : 'เริ่มสร้าง streak วันนี้!',
  },
  {
    title: '⏰ ถึงเวลาเรียนภาษาแต้จิ๋วแล้ว!',
    body: (streak) => (streak > 0 ? `ต่อยอด streak ${streak} วันเลย!` : 'เริ่มต้นวันแรกกันเลย!'),
  },
  {
    title: '🌟 ความสม่ำเสมอคือกุญแจสำคัญ',
    body: (streak) =>
      streak > 0
        ? `${streak} วันติดต่อกัน — อีกหน่อยก็ครบ milestone แล้ว!`
        : 'เรียนวันนี้เพื่อเริ่ม streak ใหม่!',
  },
  {
    title: '🎯 เป้าหมายวันนี้: เรียนแต้จิ๋ว!',
    body: (streak) => (streak > 0 ? `ไม่ให้ streak ${streak} วันสะดุดนะ!` : 'แค่ 5 นาทีก็พอ!'),
  },
  {
    title: '💪 ยังมีเวลาเรียนอีก!',
    body: (streak) => (streak > 0 ? `อย่าให้ streak ${streak} วันหายไปนะ` : 'เริ่มเรียนวันนี้เลย!'),
  },
];

/** Pick a template by rotating through the pool based on current day. */
export function pickTemplate(streak: number): { title: string; body: string } {
  const idx = new Date().getDate() % REMINDER_TEMPLATES.length;
  const template = REMINDER_TEMPLATES[idx];
  return {
    title: template.title,
    body: template.body(streak),
  };
}
