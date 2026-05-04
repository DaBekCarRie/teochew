import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface HistoryEmptyStateProps {
  onGoTranslate?: () => void;
}

export function HistoryEmptyState({ onGoTranslate }: HistoryEmptyStateProps) {
  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}
    >
      <Text style={{ fontSize: 64 }}>🕐</Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        ยังไม่มีประวัติการแปล
      </Text>
      <Text style={{ fontSize: 13, color: '#A08060', textAlign: 'center', marginTop: 8 }}>
        แปลคำหรือประโยคแล้ว{'\n'}ประวัติจะปรากฏที่นี่
      </Text>
      {onGoTranslate && (
        <Pressable
          onPress={onGoTranslate}
          style={({ pressed }) => ({
            marginTop: 24,
            borderWidth: 1,
            borderColor: '#C9A84C',
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#9A7A2E' }}>แปลเลย →</Text>
        </Pressable>
      )}
    </View>
  );
}
