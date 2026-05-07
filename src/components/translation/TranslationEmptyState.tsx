import React from 'react';
import { View, Text } from 'react-native';

const EXAMPLES = [
  { input: 'สวัสดี', output: '汝好', pengim: 'lṳ hó' },
  { input: 'ขอบคุณ', output: '多謝', pengim: 'do siā' },
];

export function TranslationEmptyState() {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 28 }}>
      {/* Ambient 潮 circle */}
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: '#EDE0C4',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          shadowColor: '#6B4C2A',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 46, fontWeight: '700', color: '#C9A84C' }}>潮</Text>
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', color: '#3C2A18', textAlign: 'center' }}>
        พิมพ์คำหรือประโยคด้านบน
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: '#A08060',
          textAlign: 'center',
          marginTop: 4,
          marginBottom: 24,
        }}
      >
        รองรับ ไทย · จีนกลาง · อังกฤษ
      </Text>

      {/* Example translation pairs */}
      <View style={{ gap: 10, width: '100%', paddingHorizontal: 4 }}>
        {EXAMPLES.map((ex, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F5EDD8',
              borderWidth: 1,
              borderColor: '#EDE0C4',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text style={{ fontSize: 15, color: '#6B4C2A', flex: 1 }}>{ex.input}</Text>
            <Text style={{ fontSize: 13, color: '#C9A84C', marginHorizontal: 10 }}>→</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C1A0E' }}>{ex.output}</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: '#9A7A2E',
                  fontFamily: 'Georgia',
                  marginTop: 1,
                }}
              >
                {ex.pengim}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
