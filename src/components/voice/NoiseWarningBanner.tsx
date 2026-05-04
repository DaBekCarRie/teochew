import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function NoiseWarningBanner() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(201,168,76,0.15)',
        borderWidth: 1,
        borderColor: '#C9A84C',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
      }}
    >
      <Ionicons name="warning-outline" size={14} color="#9A7A2E" />
      <Text style={{ fontSize: 12, color: '#9A7A2E' }}>มีเสียงรบกวน — ลองหาที่เงียบกว่านี้</Text>
    </View>
  );
}
