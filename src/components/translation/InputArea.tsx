import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  maxLength?: number;
}

export function InputArea({ value, onChangeText, onClear, maxLength = 200 }: InputAreaProps) {
  const [focused, setFocused] = useState(false);
  const nearLimit = value.length >= 180;

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderWidth: focused ? 1.5 : 1,
        borderColor: focused ? '#C9A84C' : '#D9C9A8',
        borderRadius: 18,
        padding: 16,
        shadowColor: focused ? '#C9A84C' : '#000',
        shadowOffset: { width: 0, height: focused ? 0 : 2 },
        shadowOpacity: focused ? 0.18 : 0.05,
        shadowRadius: focused ? 12 : 6,
        elevation: focused ? 3 : 1,
      }}
    >
      <TextInput
        style={{
          fontSize: 17,
          color: '#2C1A0E',
          minHeight: 100,
          maxHeight: 160,
          textAlignVertical: 'top',
          paddingRight: 36,
          lineHeight: 26,
          letterSpacing: 0.1,
        }}
        placeholder="พิมพ์คำหรือประโยค..."
        placeholderTextColor="#C4A882"
        multiline
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="done"
        accessibilityLabel="ช่องพิมพ์คำ"
        accessibilityHint="พิมพ์คำหรือประโยคที่ต้องการแปลเป็นไทย จีนกลาง และอังกฤษ"
      />

      {value.length > 0 && (
        <Pressable
          onPress={onClear}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 26,
            height: 26,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityLabel="ล้างคำ"
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={20} color="#C4A882" />
        </Pressable>
      )}

      <Text
        style={{
          fontSize: 11,
          color: nearLimit ? '#B5451B' : '#C4A882',
          fontWeight: nearLimit ? '600' : '400',
          textAlign: 'right',
          marginTop: 6,
          letterSpacing: 0.3,
        }}
      >
        {value.length} / {maxLength}
      </Text>
    </View>
  );
}
