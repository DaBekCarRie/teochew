import React, { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';
import type { BookmarkItem } from '../../types/dictionary';
import { CategoryBadge } from './CategoryBadge';
import { BookmarkButton } from './BookmarkButton';

interface SavedWordCardProps {
  item: BookmarkItem;
  isEditMode?: boolean;
  isSelected?: boolean;
  onPress: (id: string) => void;
  onToggleSelect?: (id: string) => void;
  onRemove: (id: string) => void;
}

function RightActions({ onRemove }: { onRemove: () => void }) {
  return (
    <Pressable
      className="w-[72px] items-center justify-center rounded-r-[14px] mr-5 mb-3"
      style={{ backgroundColor: '#B5451B' }}
      onPress={onRemove}
      accessibilityLabel="ลบออกจากรายการบันทึก"
      accessibilityRole="button"
    >
      <Ionicons name="trash-outline" size={22} color="#FAF6EE" />
    </Pressable>
  );
}

export function SavedWordCard({
  item,
  isEditMode = false,
  isSelected = false,
  onPress,
  onToggleSelect,
  onRemove,
}: SavedWordCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);

  function handleRemove() {
    swipeableRef.current?.close();
    onRemove(item.id);
  }

  const cardContent = (
    <Pressable
      className="bg-cream-50 border border-cream-300 rounded-[14px] p-4 mb-3 mx-5"
      onPress={() => onPress(item.id)}
      accessibilityLabel={`${item.teochew_char} แปลว่า ${item.thai_meaning}`}
      accessibilityRole="button"
      android_ripple={{ color: 'rgba(44,26,14,0.05)' }}
      style={({ pressed }) => [
        pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
        {
          shadowColor: '#2C1A0E',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        },
      ]}
    >
      {/* ROW 1: checkbox (edit) + teochew_char + bookmark */}
      <View className="flex-row items-center justify-between">
        {isEditMode && (
          <Pressable
            onPress={() => onToggleSelect?.(item.id)}
            className="mr-3 w-5 h-5 rounded border-[1.5px] items-center justify-center"
            style={{
              backgroundColor: isSelected ? '#C9A84C' : 'transparent',
              borderColor: isSelected ? '#C9A84C' : '#D9C9A8',
            }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
          >
            {isSelected && <Ionicons name="checkmark" size={12} color="#FAF6EE" />}
          </Pressable>
        )}
        <Text className="flex-1 text-[28px] font-bold text-brown-900">{item.teochew_char}</Text>
        {!isEditMode && (
          <BookmarkButton wordId={item.id} isBookmarked onToggle={() => onRemove(item.id)} />
        )}
      </View>

      {/* ROW 2: Peng'im */}
      <Text className="text-[15px] italic text-gold-700 mt-0.5">{item.teochew_pengim}</Text>

      {/* Divider */}
      <View className="border-t border-cream-300 my-2" />

      {/* ROW 3: Thai meaning */}
      <Text className="text-[15px] text-brown-900">{item.thai_meaning}</Text>

      {/* ROW 4: English meaning */}
      <Text className="text-sm text-brown-600 mt-0.5">{item.english_meaning}</Text>

      {/* Category badge */}
      {item.category && (
        <>
          <View className="border-t border-cream-300 my-2" />
          <CategoryBadge label={item.category} />
        </>
      )}
    </Pressable>
  );

  // In edit mode, disable swipe
  if (isEditMode) {
    return cardContent;
  }

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={() => <RightActions onRemove={handleRemove} />}
    >
      {cardContent}
    </ReanimatedSwipeable>
  );
}
