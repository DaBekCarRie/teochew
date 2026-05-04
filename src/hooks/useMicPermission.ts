import { useState, useEffect } from 'react';
import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync } from 'expo-audio';

type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export function useMicPermission() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');

  useEffect(() => {
    getRecordingPermissionsAsync().then((res) => {
      if (res.granted) setStatus('granted');
      else if (res.status === 'denied') setStatus('denied');
      else setStatus('undetermined');
    });
  }, []);

  async function request(): Promise<PermissionStatus> {
    const res = await requestRecordingPermissionsAsync();
    const next: PermissionStatus = res.granted
      ? 'granted'
      : res.status === 'denied'
        ? 'denied'
        : 'undetermined';
    setStatus(next);
    return next;
  }

  return { status, request };
}
