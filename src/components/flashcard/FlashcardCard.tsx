import React from 'react';
import { Pressable, View, Text, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { CategoryBadge } from '../dictionary/CategoryBadge';
import { CardAudioButton } from './CardAudioButton';
import { SwipeOverlay } from './SwipeOverlay';
import type { FlashcardItem } from '../../types/dictionary';

const CARD_HEIGHT = 420;

interface FlashcardCardProps {
  item: FlashcardItem;
  frontStyle: object;
  backStyle: object;
  rightOverlayStyle: object;
  leftOverlayStyle: object;
  onFlip: () => void;
}

export function FlashcardCard({
  item,
  frontStyle,
  backStyle,
  rightOverlayStyle,
  leftOverlayStyle,
  onFlip,
}: FlashcardCardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.min(screenWidth - 40, 360);
  const { word } = item;

  const cardBase = {
    width: cardWidth,
    height: CARD_HEIGHT,
  };

  const shadowStyle = {
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  };

  return (
    <Pressable
      onPress={onFlip}
      style={{ width: cardWidth, height: CARD_HEIGHT }}
      accessibilityLabel={`${word.teochew_char} อ่านว่า ${word.teochew_pengim} แตะเพื่อดูคำตอบ`}
      accessibilityHint="แตะเพื่อกลับการ์ด"
      accessibilityRole="button"
    >
      {/* Front face */}
      <Animated.View
        className="absolute bg-cream-50 border-[1.5px] border-cream-300 rounded-[14px] p-6 items-center justify-center"
        style={[cardBase, shadowStyle, frontStyle]}
      >
        {word.category && (
          <View className="self-start mb-6">
            <CategoryBadge label={word.category} />
          </View>
        )}

        <Text className="text-[40px] font-bold text-brown-900 text-center">
          {word.teochew_char}
        </Text>

        <Text className="text-[18px] italic text-gold-700 mt-2 text-center">
          {word.teochew_pengim}
        </Text>

        <CardAudioButton audioUrl={word.teochew_audio} size="md" />

        <Text className="text-xs text-brown-400 mt-6" style={{ opacity: 0.6 }}>
          แตะเพื่อดูคำตอบ
        </Text>

        {/* Swipe overlays sit inside the animated view so they rotate/move with card */}
        <SwipeOverlay rightStyle={rightOverlayStyle} leftStyle={leftOverlayStyle} />
      </Animated.View>

      {/* Back face */}
      <Animated.View
        className="absolute bg-cream-50 border-[1.5px] border-cream-300 rounded-[14px] p-6 items-center justify-center"
        style={[cardBase, shadowStyle, backStyle]}
      >
        {word.category && (
          <View className="self-start mb-3">
            <CategoryBadge label={word.category} />
          </View>
        )}

        {/* Teochew recap */}
        <Text className="text-2xl font-bold text-brown-900 text-center">{word.teochew_char}</Text>
        <View className="flex-row items-center gap-2 mt-1">
          <Text className="text-base italic text-gold-700">{word.teochew_pengim}</Text>
          <CardAudioButton audioUrl={word.teochew_audio} size="sm" />
        </View>

        {/* Divider */}
        <View className="w-full h-[1px] bg-cream-300 my-4" />

        {/* Thai meaning — prominent */}
        <Text className="text-[22px] font-bold text-brown-900 text-center">
          {word.thai_meaning}
        </Text>

        {word.mandarin_char && (
          <Text className="text-[18px] text-brown-600 mt-2 text-center">{word.mandarin_char}</Text>
        )}
        {word.mandarin_pinyin && (
          <Text className="text-sm text-brown-400 mt-0.5 text-center">{word.mandarin_pinyin}</Text>
        )}
        {word.english_meaning && (
          <Text className="text-base text-brown-400 mt-2 text-center">{word.english_meaning}</Text>
        )}

        <Text className="text-xs text-brown-400 mt-4" style={{ opacity: 0.6 }}>
          แตะเพื่อกลับ
        </Text>
      </Animated.View>
    </Pressable>
  );
}
