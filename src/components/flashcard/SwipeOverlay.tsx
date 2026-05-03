import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SwipeOverlayProps {
  rightStyle: object;
  leftStyle: object;
}

export function SwipeOverlay({ rightStyle, leftStyle }: SwipeOverlayProps) {
  return (
    <>
      {/* Known (right) overlay */}
      <Animated.View
        className="absolute inset-0 rounded-[14px] items-center justify-center"
        style={[
          {
            backgroundColor: 'rgba(74,124,89,0.15)',
            borderWidth: 2,
            borderColor: '#4A7C59',
            pointerEvents: 'none',
          },
          rightStyle,
        ]}
        accessibilityElementsHidden
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="checkmark-circle" size={40} color="#4A7C59" />
          <Text className="text-xl font-semibold" style={{ color: '#4A7C59' }}>
            จำได้!
          </Text>
        </View>
      </Animated.View>

      {/* Unknown (left) overlay */}
      <Animated.View
        className="absolute inset-0 rounded-[14px] items-center justify-center"
        style={[
          {
            backgroundColor: 'rgba(181,69,27,0.15)',
            borderWidth: 2,
            borderColor: '#B5451B',
            pointerEvents: 'none',
          },
          leftStyle,
        ]}
        accessibilityElementsHidden
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="close-circle" size={40} color="#B5451B" />
          <Text className="text-xl font-semibold" style={{ color: '#B5451B' }}>
            ต้องทบทวน
          </Text>
        </View>
      </Animated.View>
    </>
  );
}
