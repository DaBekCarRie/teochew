import { useEffect } from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface DownloadProgressModalProps {
  visible: boolean;
  progress: number; // 0–1
  wordCount?: number;
}

export function DownloadProgressModal({
  visible,
  progress,
  wordCount,
}: DownloadProgressModalProps) {
  const widthAnim = useSharedValue(0);

  useEffect(() => {
    widthAnim.value = withTiming(progress, { duration: 300 });
  }, [progress, widthAnim]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${widthAnim.value * 100}%` as any,
  }));

  const pct = Math.round(progress * 100);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-cream-50 rounded-2xl p-6 mx-8 w-full max-w-xs shadow-lg">
          {/* Icon + title */}
          <View className="items-center mb-4">
            <ActivityIndicator size="large" color="#C89A3A" />
            <Text className="text-brown-900 text-lg font-semibold mt-3 text-center">
              กำลังดาวน์โหลดคำศัพท์
            </Text>
            <Text className="text-brown-400 text-sm mt-1 text-center">
              เตรียมพร้อมสำหรับการใช้งานออฟไลน์
            </Text>
          </View>

          {/* Progress bar */}
          <View className="bg-cream-200 rounded-full h-2.5 overflow-hidden mb-2">
            <Animated.View className="bg-gold-500 h-full rounded-full" style={barStyle} />
          </View>

          {/* Progress text */}
          <View className="flex-row justify-between items-center">
            <Text className="text-brown-400 text-xs">
              {wordCount ? `${wordCount.toLocaleString()} คำ` : 'กำลังโหลด...'}
            </Text>
            <Text className="text-gold-700 text-xs font-semibold">{pct}%</Text>
          </View>

          <Text className="text-brown-400 text-xs text-center mt-4">กรุณารอสักครู่...</Text>
        </View>
      </View>
    </Modal>
  );
}
