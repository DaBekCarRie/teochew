import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TranslationHeaderProps {
  onHistoryPress: () => void;
}

export function TranslationHeader({ onHistoryPress }: TranslationHeaderProps) {
  return (
    <View
      style={{
        height: 52,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FAF6EE',
        borderBottomWidth: 1,
        borderBottomColor: '#EDE0C4',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 20 }}>🌐</Text>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C1A0E' }}>แปลภาษา</Text>
      </View>

      <Pressable
        onPress={onHistoryPress}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        })}
        accessibilityLabel="ประวัติการแปล"
        accessibilityRole="button"
      >
        <Ionicons name="time-outline" size={22} color="#A08060" />
      </Pressable>
    </View>
  );
}
