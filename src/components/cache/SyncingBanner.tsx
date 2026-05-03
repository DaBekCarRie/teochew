import { View, Text, ActivityIndicator } from 'react-native';

interface SyncingBannerProps {
  progress?: number; // 0–1, optional
}

export function SyncingBanner({ progress }: SyncingBannerProps) {
  const pct = progress !== undefined ? Math.round(progress * 100) : null;

  return (
    <View className="flex-row items-center bg-gold-200 border-b border-cream-200 px-4 py-2 gap-2">
      <ActivityIndicator size="small" color="#C89A3A" />
      <Text className="text-brown-600 text-xs flex-1">กำลังซิงค์คำศัพท์ใหม่...</Text>
      {pct !== null && <Text className="text-gold-700 text-xs font-semibold">{pct}%</Text>}
    </View>
  );
}
