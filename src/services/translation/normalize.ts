import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InputLang } from '../../types/translation';

const CACHE_KEY = '@teochew/translate_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface NormalizeResult {
  mandarin_char: string;
  detected_lang: InputLang;
  source: 'cache' | 'api' | 'passthrough';
}

// Small mock map for dev mode
const MOCK_MAP: Record<string, string> = {
  สวัสดี: '你好',
  ขอบคุณ: '谢谢',
  กินข้าว: '吃饭',
  น้ำ: '水',
  อาหาร: '食物',
  hello: '你好',
  'thank you': '谢谢',
  eat: '吃',
  water: '水',
  food: '食物',
  rice: '饭',
  tea: '茶',
  fish: '鱼',
  red: '红',
  white: '白',
};

function isMandarin(text: string): boolean {
  return /[一-鿿]/.test(text);
}

type CacheStore = Record<string, { mandarin_char: string; detected_lang: InputLang; ts: number }>;

async function loadCache(): Promise<CacheStore> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CacheStore) : {};
  } catch {
    return {};
  }
}

async function saveCache(cache: CacheStore): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

export async function normalizeToMandarin(
  input: string,
  lang: InputLang,
): Promise<NormalizeResult> {
  const trimmed = input.trim();

  if (lang === 'zh' || isMandarin(trimmed)) {
    return { mandarin_char: trimmed, detected_lang: 'zh', source: 'passthrough' };
  }

  const cacheKey = `${lang}:${trimmed.toLowerCase()}`;
  const cache = await loadCache();
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return {
      mandarin_char: cached.mandarin_char,
      detected_lang: cached.detected_lang,
      source: 'cache',
    };
  }

  if (__DEV__) {
    const key = trimmed.toLowerCase();
    const mandarin_char = MOCK_MAP[key] ?? trimmed;
    cache[cacheKey] = { mandarin_char, detected_lang: lang, ts: Date.now() };
    await saveCache(cache);
    return { mandarin_char, detected_lang: lang, source: 'api' };
  }

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_GOOGLE_TRANSLATE_KEY not set');

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: trimmed, target: 'zh-CN', format: 'text' }),
  });
  if (!response.ok) {
    if (response.status === 429) {
      const err = new Error('Google rate limit');
      err.name = 'RateLimitGoogleError';
      throw err;
    }
    const err = new Error('Google Translate API error');
    err.name = 'NetworkError';
    throw err;
  }
  const json = (await response.json()) as { data: { translations: { translatedText: string }[] } };
  const mandarin_char = json.data.translations[0]?.translatedText ?? trimmed;

  cache[cacheKey] = { mandarin_char, detected_lang: lang, ts: Date.now() };
  await saveCache(cache);
  return { mandarin_char, detected_lang: lang, source: 'api' };
}
