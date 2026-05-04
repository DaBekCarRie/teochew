export function confidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'สูง';
  if (confidence >= 0.5) return 'กลาง';
  return 'ต่ำ ⚠️';
}

export function confidenceBarColor(confidence: number): string {
  if (confidence >= 0.8) return 'bg-[#4A7C59]';
  if (confidence >= 0.5) return 'bg-gold-500';
  return 'bg-brick-600';
}

export function confidenceLabelColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-[#4A7C59]';
  if (confidence >= 0.5) return 'text-gold-700';
  return 'text-brick-600';
}

export function confidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}
