import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { InputLang } from '../../types/translation';

const LANGS: { value: InputLang; flag: string; label: string }[] = [
  { value: 'th', flag: '🇹🇭', label: 'ไทย' },
  { value: 'zh', flag: '🇨🇳', label: 'จีนกลาง' },
  { value: 'en', flag: '🇬🇧', label: 'อังกฤษ' },
];

interface LanguageSelectorRowProps {
  selectedLang: InputLang;
  onSelectLang: (lang: InputLang) => void;
}

export function LanguageSelectorRow({ selectedLang, onSelectLang }: LanguageSelectorRowProps) {
  const [open, setOpen] = useState(false);
  const rotate = useRef(new Animated.Value(0)).current;

  const current = LANGS.find((l) => l.value === selectedLang) ?? LANGS[0];

  function handleSwap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(rotate, { toValue: 1, duration: 125, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 0, duration: 125, useNativeDriver: true }),
    ]).start();
    const idx = LANGS.findIndex((l) => l.value === selectedLang);
    onSelectLang(LANGS[(idx + 1) % LANGS.length].value);
  }

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 12,
      }}
    >
      {/* Language dropdown */}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#F5EDD8',
          borderWidth: 1,
          borderColor: '#D9C9A8',
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 10,
          minHeight: 44,
          opacity: pressed ? 0.8 : 1,
        })}
        accessibilityLabel={`ภาษา input: ${current.label}`}
        accessibilityRole="button"
      >
        <Text style={{ fontSize: 20 }}>{current.flag}</Text>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1A0E' }}>{current.label}</Text>
        <Ionicons name="chevron-down" size={14} color="#A08060" />
      </Pressable>

      {/* Swap button */}
      <Pressable
        onPress={handleSwap}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#EDE0C4',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 1,
        })}
        accessibilityLabel="เปลี่ยนภาษา input"
        accessibilityRole="button"
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="swap-horizontal" size={20} color="#C9A84C" />
        </Animated.View>
      </Pressable>

      {/* Fixed output label — Thai / EN / Mandarin */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: '#E8D5A3',
          borderWidth: 1,
          borderColor: '#C9A84C',
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          minHeight: 44,
        }}
      >
        <Text style={{ fontSize: 18 }}>🇹🇭</Text>
        <Text style={{ fontSize: 12, color: '#9A7A2E', fontWeight: '500' }}>·</Text>
        <Text style={{ fontSize: 18 }}>🇨🇳</Text>
        <Text style={{ fontSize: 12, color: '#9A7A2E', fontWeight: '500' }}>·</Text>
        <Text style={{ fontSize: 18 }}>🇬🇧</Text>
      </View>

      {/* Language picker modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(44,26,14,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setOpen(false)}
        >
          <View
            style={{ backgroundColor: '#FAF6EE', borderRadius: 16, width: 220, overflow: 'hidden' }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#A08060',
                padding: 14,
                paddingBottom: 8,
              }}
            >
              เลือกภาษา
            </Text>
            <FlatList
              data={LANGS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelectLang(item.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    backgroundColor: pressed ? '#F5EDD8' : 'transparent',
                    borderTopWidth: 1,
                    borderTopColor: '#EDE0C4',
                    gap: 10,
                  })}
                >
                  <Text style={{ fontSize: 20 }}>{item.flag}</Text>
                  <Text style={{ fontSize: 15, color: '#2C1A0E', flex: 1 }}>{item.label}</Text>
                  {selectedLang === item.value && (
                    <Ionicons name="checkmark" size={16} color="#C9A84C" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
