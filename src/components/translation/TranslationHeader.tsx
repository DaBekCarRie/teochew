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
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 14,
        backgroundColor: '#FAF6EE',
        borderBottomWidth: 1,
        borderBottomColor: '#EDE0C4',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            color: '#C9A84C',
            letterSpacing: 3,
            marginBottom: 3,
          }}
        >
          潮州語
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#2C1A0E' }}>แปลภาษา</Text>
      </View>

      <Pressable
        onPress={onHistoryPress}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: pressed ? '#EDE0C4' : 'transparent',
          borderWidth: 1,
          borderColor: '#D9C9A8',
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 8,
          marginBottom: 2,
        })}
        accessibilityLabel="ประวัติการแปล"
        accessibilityRole="button"
      >
        <Ionicons name="time-outline" size={14} color="#A08060" />
        <Text style={{ fontSize: 12, color: '#6B4C2A', fontWeight: '500' }}>ประวัติ</Text>
      </Pressable>
    </View>
  );
}
