import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface PermissionRequestViewProps {
  onRequest: () => void;
}

export function PermissionRequestView({ onRequest }: PermissionRequestViewProps) {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 64 }}>🎙️</Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 20,
        }}
      >
        แอป Teochew ต้องการเข้าถึงไมค์
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#A08060',
          textAlign: 'center',
          marginTop: 8,
          lineHeight: 22,
        }}
      >
        เพื่ออัดเสียงแต้จิ๋วที่คุณพูด{'\n'}ข้อมูลเสียงจะไม่ถูกเก็บไว้บนคลาวด์
      </Text>
      <Pressable
        onPress={onRequest}
        style={({ pressed }) => ({
          backgroundColor: '#B5451B',
          borderRadius: 12,
          paddingHorizontal: 24,
          paddingVertical: 12,
          marginTop: 24,
          opacity: pressed ? 0.85 : 1,
        })}
        accessibilityLabel="อนุญาต"
        accessibilityRole="button"
      >
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#FAF6EE' }}>อนุญาต</Text>
      </Pressable>
    </View>
  );
}
