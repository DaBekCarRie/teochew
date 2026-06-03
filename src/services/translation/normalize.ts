import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Lang } from '../../types/translation';

const CACHE_KEY = '@teochew/translate_cache_v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CacheStore = Record<string, { output: string; ts: number }>;

// Dev mode mock translations for all 6 directions
const DEV_MAP: Record<string, Record<string, string>> = {
  'th|zh': {
    สวัสดี: '你好',
    ขอบคุณ: '谢谢',
    กินข้าว: '吃饭',
    น้ำ: '水',
    อาหาร: '食物',
    อร่อย: '好吃',
  },
  'zh|th': {
    你好: 'สวัสดี',
    谢谢: 'ขอบคุณ',
    吃饭: 'กินข้าว',
    水: 'น้ำ',
    食物: 'อาหาร',
    好吃: 'อร่อย',
  },
  'en|zh': {
    hello: '你好',
    'thank you': '谢谢',
    eat: '吃',
    water: '水',
    food: '食物',
    delicious: '好吃',
    tea: '茶',
  },
  'zh|en': {
    你好: 'hello',
    谢谢: 'thank you',
    水: 'water',
    食物: 'food',
    好吃: 'delicious',
    茶: 'tea',
  },
  'th|en': {
    สวัสดี: 'hello',
    ขอบคุณ: 'thank you',
    น้ำ: 'water',
    อาหาร: 'food',
    อร่อย: 'delicious',
  },
  'en|th': {
    hello: 'สวัสดี',
    'thank you': 'ขอบคุณ',
    water: 'น้ำ',
    food: 'อาหาร',
    delicious: 'อร่อย',
    tea: 'ชา',
  },
  'th|tc': {
    สวัสดี: 'ทักทาย',
    ขอบคุณ: 'กัมเซีย',
    กินข้าว: 'เจียะปึ่ง',
    น้ำ: 'จุ๊ย',
  },
  'tc|th': {
    กัมเซีย: 'ขอบคุณ',
    เจียะปึ่ง: 'กินข้าว',
    จุ๊ย: 'น้ำ',
  },
};

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

export async function callMyMemory(text: string, from: Lang, to: Lang): Promise<string> {
  const trimmed = text.trim();
  const pair = `${from}|${to}`;
  const cacheKey = `${pair}:${trimmed.toLowerCase()}`;

  if (__DEV__) {
    const mock = DEV_MAP[pair]?.[trimmed.toLowerCase()] ?? DEV_MAP[pair]?.[trimmed];
    if (mock) return mock;
    return `[${trimmed}→${to}]`;
  }

  const cache = await loadCache();
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.output;
  }

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${pair}`;
  const response = await fetch(url);
  if (!response.ok) {
    const err = new Error('MyMemory API error');
    err.name = 'NetworkError';
    throw err;
  }

  const json = (await response.json()) as {
    responseData: { translatedText: string };
    responseStatus: number;
  };

  if (json.responseStatus === 429) {
    const err = new Error('MyMemory rate limit');
    err.name = 'RateLimitError';
    throw err;
  }

  const output = json.responseData.translatedText ?? trimmed;
  cache[cacheKey] = { output, ts: Date.now() };
  await saveCache(cache);
  return output;
}
