import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { FlashcardCard } from './FlashcardCard';
import type { FlashcardItem } from '../../types/dictionary';

const CARD_HEIGHT = 420;

interface CardStackProps {
  currentCard: FlashcardItem;
  nextCards: FlashcardItem[]; // up to 2
  frontStyle: object;
  backStyle: object;
  cardAnimatedStyle: object;
  rightOverlayStyle: object;
  leftOverlayStyle: object;
  panGesture: ReturnType<typeof import('react-native-gesture-handler').Gesture.Pan>;
  onFlip: () => void;
}

export function CardStack({
  currentCard,
  nextCards,
  frontStyle,
  backStyle,
  cardAnimatedStyle,
  rightOverlayStyle,
  leftOverlayStyle,
  panGesture,
  onFlip,
}: CardStackProps) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.min(screenWidth - 40, 360);

  const layers = nextCards.slice(0, 2);

  return (
    <View
      style={{
        width: cardWidth,
        height: CARD_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Stack layers — rendered behind, offset downward */}
      {layers
        .slice()
        .reverse()
        .map((card, idx) => {
          const isLayer2 = idx === 0 && layers.length === 2;
          const scale = isLayer2 ? 0.92 : 0.96;
          const translateY = isLayer2 ? 12 : 6;
          const opacity = isLayer2 ? 0.4 : 0.7;
          return (
            <View
              key={card.word.id}
              className="absolute bg-cream-50 border border-cream-300 rounded-[14px]"
              style={{
                width: cardWidth,
                height: CARD_HEIGHT,
                transform: [{ scale }, { translateY }],
                opacity,
              }}
            />
          );
        })}

      {/* Active card with gesture */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ width: cardWidth, height: CARD_HEIGHT }, cardAnimatedStyle]}>
          <FlashcardCard
            item={currentCard}
            frontStyle={frontStyle}
            backStyle={backStyle}
            rightOverlayStyle={rightOverlayStyle}
            leftOverlayStyle={leftOverlayStyle}
            onFlip={onFlip}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
