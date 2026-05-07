import React, { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons } from '@expo/vector-icons';
import type { BookmarkItem } from '../../types/dictionary';
import { CategoryBadge } from './CategoryBadge';
import { BookmarkButton } from './BookmarkButton';
import { TTSButton } from './TTSButton';

import { useUserStore } from '../../stores/userStore';

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
  const { language } = useUserStore();

  function handleRemove() {
    swipeableRef.current?.close();
    onRemove(item.id);
  }

  const thaiNode = item.thai_meaning ? (
    <Text
      key="th"
      className={language === 'th' ? 'text-[15px] text-brown-900' : 'text-sm text-brown-600 mt-0.5'}
    >
      {item.thai_meaning}
    </Text>
  ) : null;

  const enNode = item.english_meaning ? (
    <Text
      key="en"
      className={language === 'en' ? 'text-[15px] text-brown-900' : 'text-sm text-brown-600 mt-0.5'}
    >
      {item.english_meaning}
    </Text>
  ) : null;

  // We add a dummy ZH node for bookmarks since BookmarkItem only has thai and english.
  // We can just leave it out for now, or display something if it had mandarin in the BookmarkItem type.

  const orderedNodes = [];
  if (language === 'th') {
    orderedNodes.push(thaiNode, enNode);
  } else {
    // English or ZH (but we don't have ZH in BookmarkItem)
    orderedNodes.push(enNode, thaiNode);
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

      {/* ROW 2: TTS buttons */}
      <View className="flex-row items-center gap-2 mt-1.5">
        <TTSButton text={item.thai_meaning} language="th" />
        <TTSButton text={item.english_meaning} language="en" />
      </View>

      {/* Divider */}
      <View className="border-t border-cream-300 my-2" />

      {/* Meanings */}
      {orderedNodes}

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
