import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  isLoading = false,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-cream-200 border border-cream-300 rounded-[10px] px-4 h-[48px] mt-2">
      {isLoading ? (
        <ActivityIndicator size="small" color="#C9A84C" />
      ) : (
        <Ionicons name="search" size={18} color="#A08060" />
      )}

      <TextInput
        className="flex-1 text-base text-brown-900 ml-2"
        placeholder="ค้นหา... (ไทย / EN / 中文 / Peng'im)"
        placeholderTextColor="#A08060"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        keyboardType="default"
        maxLength={100}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoFocus={autoFocus}
        accessibilityLabel="ช่องค้นหาคำศัพท์"
        accessibilityHint="พิมพ์คำในภาษาไทย อังกฤษ จีน หรือ Peng'im"
      />

      {value.length > 0 && (
        <TouchableOpacity
          className="w-8 h-8 items-center justify-center"
          onPress={onClear}
          accessibilityLabel="ล้างคำค้นหา"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={16} color="#A08060" />
        </TouchableOpacity>
      )}
    </View>
  );
}
