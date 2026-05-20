import React, { useRef } from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';

export interface Category {
  value: string | null; // null = "ทั้งหมด"
  label: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { value: null, label: 'ทั้งหมด', icon: '📚' },
  { value: 'การเคลื่อนไหวและกริยา', label: 'กริยา', icon: '🏃' },
  { value: 'อาหารและเครื่องดื่ม', label: 'อาหาร', icon: '🍜' },
  { value: 'ครอบครัวและความสัมพันธ์', label: 'ครอบครัว', icon: '👨‍👩‍👧' },
  { value: 'ร่างกายมนุษย์', label: 'ร่างกาย', icon: '🫀' },
  { value: 'ตัวเลขและปริมาณ', label: 'ตัวเลข', icon: '🔢' },
  { value: 'สัตว์', label: 'สัตว์', icon: '🐾' },
  { value: 'ธรรมชาติและสิ่งแวดล้อม', label: 'ธรรมชาติ', icon: '🌿' },
  { value: 'จิตวิทยาและอารมณ์', label: 'อารมณ์', icon: '😊' },
  { value: 'เวลาและวันที่', label: 'เวลา', icon: '⏰' },
  { value: 'คำคุณศัพท์บุคลิกภาพ', label: 'คุณศัพท์', icon: '✨' },
  { value: 'ทั่วไป', label: 'ทั่วไป', icon: '💬' },
];

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (value: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <Pressable
            key={cat.value ?? '__all__'}
            onPress={() => onSelect(cat.value)}
            accessibilityRole="button"
            accessibilityLabel={`หมวด${cat.label}`}
            accessibilityState={{ selected: isActive }}
            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
          >
            <View
              className={[
                'flex-row items-center rounded-full px-3 py-1.5 border',
                isActive ? 'bg-gold-500 border-gold-700' : 'bg-cream-100 border-cream-300',
              ].join(' ')}
            >
              <Text style={{ fontSize: 14, marginRight: 4 }}>{cat.icon}</Text>
              <Text
                className={[
                  'text-sm font-medium',
                  isActive ? 'text-cream-50' : 'text-brown-600',
                ].join(' ')}
              >
                {cat.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
