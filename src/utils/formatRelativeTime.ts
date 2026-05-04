export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'เมื่อกี้';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days === 1) return 'เมื่อวาน';
  if (days < 7) return `${days} วันที่แล้ว`;
  return new Date(isoString).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}
