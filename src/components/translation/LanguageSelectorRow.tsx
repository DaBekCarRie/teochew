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
    <>
      <View style={{ marginTop: 20, marginBottom: 14 }}>
        {/* Column labels */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 7,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: '#A08060',
              letterSpacing: 1.5,
              marginLeft: 4,
            }}
          >
            จาก
          </Text>
          <View style={{ width: 60 }} />
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: '#9A7A2E',
              letterSpacing: 1.5,
              marginRight: 4,
            }}
          >
            เป็น
          </Text>
        </View>

        {/* Selector row */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Source dropdown */}
          <Pressable
            onPress={() => setOpen(true)}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#F5EDD8',
              borderWidth: 1,
              borderColor: '#D9C9A8',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              opacity: pressed ? 0.8 : 1,
            })}
            accessibilityLabel={`ภาษา input: ${current.label}`}
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 18 }}>{current.flag}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1A0E', flex: 1 }}>
              {current.label}
            </Text>
            <Ionicons name="chevron-down" size={13} color="#A08060" />
          </Pressable>

          {/* Cycle button */}
          <Pressable
            onPress={handleSwap}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              marginHorizontal: 8,
              borderRadius: 22,
              backgroundColor: pressed ? '#D9C9A8' : '#EDE0C4',
              alignItems: 'center',
              justifyContent: 'center',
            })}
            accessibilityLabel="เปลี่ยนภาษา input"
            accessibilityRole="button"
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="swap-horizontal" size={18} color="#C9A84C" />
            </Animated.View>
          </Pressable>

          {/* Fixed Teochew output */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#EDE0C4',
              borderWidth: 1.5,
              borderColor: '#C9A84C',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#9A7A2E' }}>潮</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#9A7A2E' }}>แต้จิ๋ว</Text>
          </View>
        </View>
      </View>

      {/* Language picker modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(44,26,14,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setOpen(false)}
        >
          <View
            style={{ backgroundColor: '#FAF6EE', borderRadius: 18, width: 220, overflow: 'hidden' }}
          >
            <View
              style={{
                padding: 14,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#EDE0C4',
              }}
            >
              <Text
                style={{ fontSize: 11, fontWeight: '700', color: '#A08060', letterSpacing: 1.5 }}
              >
                เลือกภาษา
              </Text>
            </View>
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
                    paddingVertical: 14,
                    backgroundColor: pressed ? '#F5EDD8' : 'transparent',
                    borderTopWidth: 1,
                    borderTopColor: '#EDE0C4',
                    gap: 10,
                  })}
                >
                  <Text style={{ fontSize: 18 }}>{item.flag}</Text>
                  <Text style={{ fontSize: 14, color: '#2C1A0E', flex: 1, fontWeight: '500' }}>
                    {item.label}
                  </Text>
                  {selectedLang === item.value && (
                    <Ionicons name="checkmark-circle" size={18} color="#C9A84C" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
