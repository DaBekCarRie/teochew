export interface TextSegment {
  text: string;
  highlight: boolean;
}

export function splitHighlight(text: string, query: string): TextSegment[] {
  if (!query || query.trim().length < 2) {
    return [{ text, highlight: false }];
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      highlight: regex.test(part),
    }));
}
