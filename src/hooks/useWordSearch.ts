import { useState, useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { searchWords } from '../services/supabase/words';
import { searchCachedWords, isCachePopulated } from '../services/offlineCache';
import type { WordEntry } from '../types/dictionary';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

interface UseWordSearchResult {
  results: WordEntry[];
  status: SearchStatus;
  errorMsg: string | null;
  isOffline: boolean;
  retry: () => void;
}

export function useWordSearch(
  debouncedQuery: string,
  category?: string | null,
): UseWordSearchResult {
  const [results, setResults] = useState<WordEntry[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const cancelledRef = useRef(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 1) {
      setStatus('idle');
      setResults([]);
      return;
    }

    cancelledRef.current = false;
    setStatus('loading');
    setErrorMsg(null);

    (async () => {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        if (!cancelledRef.current) {
          setIsOffline(true);
          // Fall back to local cache if available
          const populated = await isCachePopulated();
          if (populated) {
            const cached = await searchCachedWords(debouncedQuery.trim(), category);
            if (!cancelledRef.current) {
              setResults(cached);
              setStatus(cached.length > 0 ? 'success' : 'empty');
            }
          } else {
            setStatus('error');
          }
        }
        return;
      }
      setIsOffline(false);

      try {
        const data = await searchWords(debouncedQuery.trim(), category);
        if (cancelledRef.current) return;
        setResults(data);
        setStatus(data.length > 0 ? 'success' : 'empty');
      } catch (err) {
        if (cancelledRef.current) return;
        setErrorMsg(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
        setStatus('error');
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [debouncedQuery, category, retryCount]);

  const retry = () => {
    setRetryCount((c) => c + 1);
  };

  return { results, status, errorMsg, isOffline, retry };
}
