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

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: focused ? 2 : 1,
        borderColor: focused ? '#C9A84C' : '#D9C9A8',
        borderRadius: 14,
        padding: 14,
        marginTop: 4,
      }}
    >
      <TextInput
        style={{
          fontSize: 17,
          color: '#2C1A0E',
          minHeight: 96,
          maxHeight: 160,
          textAlignVertical: 'top',
          paddingRight: 28,
        }}
        placeholder="พิมพ์คำหรือประโยค..."
        placeholderTextColor="#A08060"
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
        >
          <Ionicons name="close-circle" size={20} color="#A08060" />
        </Pressable>
      )}

      <Text
        style={{
          fontSize: 11,
          color: value.length >= 180 ? '#B5451B' : '#A08060',
          textAlign: 'right',
          marginTop: 6,
        }}
      >
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}
