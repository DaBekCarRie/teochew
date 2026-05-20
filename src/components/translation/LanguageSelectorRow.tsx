import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { Lang } from '../../types/translation';

const LANGS: { value: Lang; flag: string; label: string }[] = [
  { value: 'th', flag: '🇹🇭', label: 'ไทย' },
  { value: 'zh', flag: '🇨🇳', label: 'จีนกลาง' },
  { value: 'en', flag: '🇬🇧', label: 'อังกฤษ' },
];

interface LanguageSelectorRowProps {
  sourceLang: Lang;
  targetLang: Lang;
  onSelectSource: (lang: Lang) => void;
  onSelectTarget: (lang: Lang) => void;
  onSwap: () => void;
}

export function LanguageSelectorRow({
  sourceLang,
  targetLang,
  onSelectSource,
  onSelectTarget,
  onSwap,
}: LanguageSelectorRowProps) {
  const [openSide, setOpenSide] = useState<'source' | 'target' | null>(null);
  const rotate = useRef(new Animated.Value(0)).current;

  const sourceLangItem = LANGS.find((l) => l.value === sourceLang) ?? LANGS[0];
  const targetLangItem = LANGS.find((l) => l.value === targetLang) ?? LANGS[1];

  function handleSwap() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(rotate, { toValue: 1, duration: 140, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 0, duration: 140, useNativeDriver: true }),
    ]).start();
    onSwap();
  }

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  // Modal shows all langs except the one on the *opposite* side
  const oppositeForOpen = openSide === 'source' ? targetLang : sourceLang;
  const modalOptions = LANGS.filter((l) => l.value !== oppositeForOpen);
  const currentModalSelection = openSide === 'source' ? sourceLang : targetLang;

  function handleModalSelect(lang: Lang) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (openSide === 'source') onSelectSource(lang);
    else onSelectTarget(lang);
    setOpenSide(null);
  }

  return (
    <>
      <View style={styles.row}>
        {/* Source pill */}
        <View style={styles.pillWrap}>
          <Pressable
            onPress={() => setOpenSide('source')}
            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
            accessibilityLabel={`ภาษาต้นทาง: ${sourceLangItem.label}`}
            accessibilityRole="button"
          >
            <View style={styles.sourcePill}>
              <Text style={styles.pillFlag}>{sourceLangItem.flag}</Text>
              <Text style={styles.pillLabel}>{sourceLangItem.label}</Text>
              <Ionicons name="chevron-down" size={12} color="#A08060" />
            </View>
          </Pressable>
        </View>

        {/* Swap button */}
        <View style={styles.swapWrap}>
          <Pressable
            onPress={handleSwap}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            accessibilityLabel="สลับทิศทางการแปล"
            accessibilityRole="button"
          >
            <View style={styles.swapBtn}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name="swap-horizontal" size={16} color="#9A7A2E" />
              </Animated.View>
            </View>
          </Pressable>
        </View>

        {/* Target pill */}
        <View style={styles.pillWrap}>
          <Pressable
            onPress={() => setOpenSide('target')}
            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
            accessibilityLabel={`ภาษาปลายทาง: ${targetLangItem.label}`}
            accessibilityRole="button"
          >
            <View style={styles.targetPill}>
              <Text style={styles.pillFlag}>{targetLangItem.flag}</Text>
              <Text style={styles.pillLabel}>{targetLangItem.label}</Text>
              <Ionicons name="chevron-down" size={12} color="#9A7A2E" />
            </View>
          </Pressable>
        </View>
      </View>

      {/* Language picker modal */}
      <Modal
        visible={openSide !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenSide(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setOpenSide(null)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {openSide === 'source' ? 'เลือกภาษาต้นทาง' : 'เลือกภาษาปลายทาง'}
              </Text>
            </View>
            <FlatList
              data={modalOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleModalSelect(item.value)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                >
                  <View
                    style={[
                      styles.modalRow,
                      currentModalSelection === item.value && styles.modalRowSelected,
                    ]}
                  >
                    <Text style={styles.modalFlag}>{item.flag}</Text>
                    <Text
                      style={[
                        styles.modalLangLabel,
                        currentModalSelection === item.value && styles.modalLangLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {currentModalSelection === item.value && (
                      <Ionicons name="checkmark-circle" size={18} color="#C9A84C" />
                    )}
                  </View>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E6CC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9C9A8',
    padding: 6,
    gap: 6,
  },
  pillWrap: {
    flex: 1,
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAF6EE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#D9C9A8',
  },
  targetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EDE0C4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: '#C9A84C',
  },
  pillFlag: {
    fontSize: 18,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1A0E',
    flex: 1,
    fontFamily: 'Sarabun',
  },
  swapWrap: {
    flexShrink: 0,
  },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE0C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44,26,14,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#FAF6EE',
    borderRadius: 20,
    width: 230,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE0C4',
  },
  modalTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A08060',
    letterSpacing: 1.5,
    fontFamily: 'Sarabun',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EDE0C4',
    gap: 12,
    backgroundColor: 'transparent',
  },
  modalRowSelected: {
    backgroundColor: '#F5EDD8',
  },
  modalFlag: {
    fontSize: 20,
  },
  modalLangLabel: {
    fontSize: 15,
    color: '#4A3020',
    flex: 1,
    fontWeight: '500',
    fontFamily: 'Sarabun',
  },
  modalLangLabelSelected: {
    color: '#2C1A0E',
    fontWeight: '700',
  },
});
