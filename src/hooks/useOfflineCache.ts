import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getCacheMetadata,
  isCachePopulated,
  downloadCache,
  syncCacheBackground,
  clearCache,
} from '../services/offlineCache';

export type CacheStatus = 'idle' | 'downloading' | 'syncing' | 'ready' | 'error';

interface UseOfflineCacheResult {
  cacheStatus: CacheStatus;
  progress: number;
  wordCount: number;
  lastSyncAt: string | null;
  isPopulated: boolean;
  initializeCache: () => Promise<void>;
  refreshCache: () => Promise<void>;
  clearCache: () => Promise<void>;
}

export function useOfflineCache(): UseOfflineCacheResult {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [isPopulated, setIsPopulated] = useState(false);
  const activeRef = useRef(false);

  // Load initial metadata on mount
  useEffect(() => {
    getCacheMetadata().then((meta) => {
      setWordCount(meta.wordCount);
      setLastSyncAt(meta.lastSyncAt);
      setIsPopulated(meta.wordCount > 0);
    });
  }, []);

  const initializeCache = useCallback(async () => {
    if (activeRef.current) return;
    activeRef.current = true;
    setCacheStatus('downloading');
    setProgress(0);
    try {
      const count = await downloadCache((p) => setProgress(p));
      setWordCount(count);
      setLastSyncAt(new Date().toISOString());
      setIsPopulated(count > 0);
      setCacheStatus('ready');
    } catch {
      setCacheStatus('error');
    } finally {
      activeRef.current = false;
    }
  }, []);

  const refreshCache = useCallback(async () => {
    if (activeRef.current) return;
    activeRef.current = true;
    setCacheStatus('syncing');
    setProgress(0);
    try {
      await syncCacheBackground((p) => setProgress(p));
      const meta = await getCacheMetadata();
      setWordCount(meta.wordCount);
      setLastSyncAt(meta.lastSyncAt);
      setIsPopulated(meta.wordCount > 0);
      setCacheStatus('ready');
    } catch {
      setCacheStatus('error');
    } finally {
      activeRef.current = false;
    }
  }, []);

  const handleClearCache = useCallback(async () => {
    await clearCache();
    setWordCount(0);
    setLastSyncAt(null);
    setIsPopulated(false);
    setCacheStatus('idle');
    setProgress(0);
  }, []);

  return {
    cacheStatus,
    progress,
    wordCount,
    lastSyncAt,
    isPopulated,
    initializeCache,
    refreshCache,
    clearCache: handleClearCache,
  };
}

export { isCachePopulated };
