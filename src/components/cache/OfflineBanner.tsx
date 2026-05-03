import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OfflineBannerProps {
  /** true = cache available, false = offline with no cache */
  hasCache: boolean;
  /** Only shown when hasCache=false, to trigger download when back online */
  onDownloadWhenOnline?: () => void;
}

/**
 * Variant A — offline but has local cache: muted info banner
 * Variant B — offline with NO cache: warning banner with message
 */
export function OfflineBanner({ hasCache, onDownloadWhenOnline }: OfflineBannerProps) {
  if (hasCache) {
    // Variant A — subtle
    return (
      <View className="flex-row items-center bg-cream-100 border-b border-cream-200 px-4 py-2 gap-2">
        <Ionicons name="cloud-offline-outline" size={14} color="#9C8063" />
        <Text className="text-brown-400 text-xs flex-1">ออฟไลน์ — แสดงผลจากแคชในเครื่อง</Text>
      </View>
    );
  }

  // Variant B — no cache, more prominent
  return (
    <View className="flex-row items-center bg-brick-200 border-b border-brick-200 px-4 py-3 gap-2">
      <Ionicons name="warning-outline" size={16} color="#B73C3C" />
      <Text className="text-brick-600 text-xs flex-1">
        ไม่มีการเชื่อมต่ออินเทอร์เน็ตและยังไม่มีแคชในเครื่อง
      </Text>
      {onDownloadWhenOnline && (
        <Pressable onPress={onDownloadWhenOnline} hitSlop={8}>
          <Text className="text-brick-600 text-xs font-semibold underline">
            ดาวน์โหลดเมื่อออนไลน์
          </Text>
        </Pressable>
      )}
    </View>
  );
}
