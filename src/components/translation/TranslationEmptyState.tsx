import React from 'react';
import { View, Text } from 'react-native';

export function TranslationEmptyState() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
      <Text style={{ fontSize: 64 }}>🎮</Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '500',
          color: '#6B4C2A',
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        พิมพ์คำหรือประโยคด้านบน
      </Text>
      <Text style={{ fontSize: 13, color: '#A08060', textAlign: 'center', marginTop: 6 }}>
        แล้วกด 'แปล' เพื่อเริ่มต้น
      </Text>
    </View>
  );
}
