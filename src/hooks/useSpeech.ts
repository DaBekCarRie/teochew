import { useState, useCallback, useRef } from 'react';
import * as Speech from 'expo-speech';

export type SpeechLanguage = 'th' | 'en' | 'zh';

const LANG_CODES: Record<SpeechLanguage, string> = {
  th: 'th-TH',
  en: 'en-US',
  zh: 'zh-CN',
};

export function useSpeech() {
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const currentKeyRef = useRef<string | null>(null);

  const speak = useCallback((text: string, language: SpeechLanguage) => {
    if (!text.trim()) return;
    const key = `${language}:${text}`;

    if (currentKeyRef.current === key) {
      Speech.stop();
      currentKeyRef.current = null;
      setSpeakingKey(null);
      return;
    }

    Speech.stop();
    currentKeyRef.current = key;
    setSpeakingKey(key);

    Speech.speak(text, {
      language: LANG_CODES[language],
      onDone: () => {
        if (currentKeyRef.current === key) {
          currentKeyRef.current = null;
          setSpeakingKey(null);
        }
      },
      onError: () => {
        if (currentKeyRef.current === key) {
          currentKeyRef.current = null;
          setSpeakingKey(null);
        }
      },
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
    currentKeyRef.current = null;
    setSpeakingKey(null);
  }, []);

  const isSpeaking = useCallback(
    (text: string, language: SpeechLanguage) => speakingKey === `${language}:${text}`,
    [speakingKey],
  );

  return { speak, stop, isSpeaking };
}
