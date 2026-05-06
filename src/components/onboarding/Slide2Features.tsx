import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  SharedValue,
} from 'react-native-reanimated';

const FEATURES = [
  {
    id: 0,
    icon: '📚',
    title: 'พจนานุกรม',
    subtitle: 'ค้นหาคำแต้จิ๋วจากไทย จีนกลาง หรืออังกฤษ',
    color: '#EAD9B8', // cream-200
  },
  {
    id: 1,
    icon: '🔄',
    title: 'แปลภาษา',
    subtitle: 'พิมพ์แล้วแปลเป็นแต้จิ๋วได้ทันที 4 ภาษา',
    color: '#F5EDD9', // cream-100
  },
  {
    id: 2,
    icon: '🎙️',
    title: 'อัดเสียง',
    subtitle: 'พูดแต้จิ๋ว — ระบบถอดเสียงและแปลให้อัตโนมัติ',
    color: '#F1A99A', // brick-200
  },
];

export function Slide2Features() {
  const activeIndex = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % FEATURES.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#2C1A0E',
          textAlign: 'center',
          marginBottom: 32,
          fontFamily: 'Sarabun',
        }}
      >
        แอปนี้ทำอะไรได้บ้าง?
      </Text>

      <View style={{ gap: 12 }}>
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} activeIndex={activeIndex} />
        ))}
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 40,
          fontFamily: 'Sarabun',
        }}
      >
        พูดแต้จิ๋ว → <Text style={{ color: '#B5451B' }}>แปลไทยได้ทันที</Text>
      </Text>
    </View>
  );
}

function FeatureCard({
  feature,
  activeIndex,
}: {
  feature: (typeof FEATURES)[0];
  activeIndex: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === feature.id;
    return {
      height: withSpring(isActive ? 140 : 64),
      backgroundColor: feature.color,
      shadowOpacity: withTiming(isActive ? 0.1 : 0),
      elevation: isActive ? 4 : 0,
      opacity: withTiming(isActive ? 1 : 0.6),
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === feature.id;
    return {
      opacity: withTiming(isActive ? 1 : 0),
      height: withTiming(isActive ? 'auto' : 0),
      marginTop: withTiming(isActive ? 8 : 0),
    };
  });

  return (
    <Animated.View
      style={[
        {
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: '#D9C9A8',
          shadowColor: '#2C1A0E',
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          overflow: 'hidden',
        },
        animatedStyle,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={{ fontSize: 28 }}>{feature.icon}</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#2C1A0E', fontFamily: 'Sarabun' }}>
          {feature.title}
        </Text>
      </View>
      <Animated.Text
        style={[
          { fontSize: 14, color: '#7C4B35', fontFamily: 'Sarabun', lineHeight: 20 },
          subtitleStyle,
        ]}
      >
        {feature.subtitle}
      </Animated.Text>
    </Animated.View>
  );
}
