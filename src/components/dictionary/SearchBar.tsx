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
    <View className="flex-row items-center bg-white dark:bg-[#2C2C2E] border border-gray-200 dark:border-[#3A3A3C] rounded-full px-3 h-11 mt-2">
      {isLoading ? (
        <ActivityIndicator size="small" color="#C84B31" />
      ) : (
        <Ionicons name="search" size={20} color="#9CA3AF" />
      )}

      <TextInput
        className="flex-1 text-base text-gray-900 dark:text-white ml-2"
        placeholder="ค้นหา... (ไทย / EN / 中文 / Peng'im)"
        placeholderTextColor="#9CA3AF"
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
          <Ionicons name="close-circle" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
