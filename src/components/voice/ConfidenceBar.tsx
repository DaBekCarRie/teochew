import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { confidenceLabel } from '../../utils/confidenceHelpers';

interface ConfidenceBarProps {
  confidence: number;
}

export function ConfidenceBar({ confidence }: ConfidenceBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(confidence * 100, { duration: 600 });
  }, [confidence, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%` as `${number}%`,
  }));

  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 1, now: confidence }}
    >
      <View
        style={{
          flex: 1,
          height: 6,
          backgroundColor: '#EDE0C4',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[
            { height: '100%', borderRadius: 3, backgroundColor: '#B5451B' },
            fillStyle,
            {
              backgroundColor:
                confidence >= 0.8 ? '#4A7C59' : confidence >= 0.5 ? '#C9A84C' : '#B5451B',
            },
          ]}
        />
      </View>
      <Text
        style={[
          { fontSize: 12, fontWeight: '500' },
          { color: confidence >= 0.8 ? '#4A7C59' : confidence >= 0.5 ? '#9A7A2E' : '#B5451B' },
        ]}
      >
        {confidenceLabel(confidence)}
      </Text>
    </View>
  );
}

export function ConfidenceMini({ confidence }: { confidence: number }) {
  const level = confidence >= 0.8 ? 'high' : confidence >= 0.5 ? 'medium' : 'low';
  const fillColor = level === 'high' ? '#4A7C59' : level === 'medium' ? '#C9A84C' : '#B5451B';
  const textColor = level === 'high' ? '#4A7C59' : level === 'medium' ? '#9A7A2E' : '#B5451B';
  const label = level === 'high' ? 'สูง' : level === 'medium' ? 'กลาง' : 'ต่ำ';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: 48,
          height: 4,
          backgroundColor: '#EDE0C4',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${confidence * 100}%`,
            height: '100%',
            backgroundColor: fillColor,
            borderRadius: 2,
          }}
        />
      </View>
      <Text style={{ fontSize: 11, color: textColor }}>{label}</Text>
    </View>
  );
}
