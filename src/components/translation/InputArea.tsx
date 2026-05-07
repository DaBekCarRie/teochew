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
        backgroundColor: '#F5EDD8',
        borderWidth: focused ? 2 : 1,
        borderColor: focused ? '#C9A84C' : '#D9C9A8',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#C9A84C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: focused ? 0.22 : 0,
        shadowRadius: 10,
        elevation: focused ? 2 : 0,
      }}
    >
      <TextInput
        style={{
          fontSize: 17,
          color: '#2C1A0E',
          minHeight: 100,
          maxHeight: 160,
          textAlignVertical: 'top',
          paddingRight: 32,
          lineHeight: 24,
        }}
        placeholder="พิมพ์คำหรือประโยค..."
        placeholderTextColor="#B8997A"
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
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityLabel="ล้างคำ"
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={20} color="#B8997A" />
        </Pressable>
      )}

      <Text
        style={{
          fontSize: 11,
          color: nearLimit ? '#B5451B' : '#B8997A',
          fontWeight: nearLimit ? '600' : '400',
          textAlign: 'right',
          marginTop: 8,
        }}
      >
        {value.length} / {maxLength}
      </Text>
    </View>
  );
}
