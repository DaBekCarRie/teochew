import { useUserStore } from '../stores/userStore';

export function usePlaybackSpeed(): number {
  const speed = useUserStore((state) => state.playbackSpeed);
  return parseFloat(speed);
}
