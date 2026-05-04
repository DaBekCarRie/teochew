import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TONES } from '../../utils/toneData';
import type { ToneInfo } from '../../utils/toneData';

interface ToneCompareSectionProps {
  selectedTones: [number | null, number | null];
  onSelectTone: (index: 0 | 1, tone: number) => void;
  onPlayCompare: () => void;
}

function TonePicker({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: number | null;
  onSelect: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const tone = selected !== null ? TONES.find((t) => t.number === selected) : null;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flex: 1,
          backgroundColor: '#FAF6EE',
          borderWidth: 1.5,
          borderColor: '#D9C9A8',
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          opacity: pressed ? 0.8 : 1,
        })}
        accessibilityRole="button"
        accessibilityLabel={`เลือกเสียงที่ ${label} สำหรับเปรียบเทียบ`}
      >
        {tone ? (
          <>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: tone.color,
                marginRight: 6,
              }}
            />
            <Text style={{ fontSize: 14, color: '#2C1A0E', flex: 1 }}>เสียงที่ {tone.number}</Text>
          </>
        ) : (
          <Text style={{ fontSize: 14, color: '#A08060', flex: 1 }}>{label}</Text>
        )}
        <Ionicons name="chevron-down" size={14} color="#A08060" />
      </Pressable>

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
            style={{ backgroundColor: '#FAF6EE', borderRadius: 16, width: 240, overflow: 'hidden' }}
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
              เลือกเสียง
            </Text>
            <FlatList
              data={TONES}
              keyExtractor={(item) => String(item.number)}
              renderItem={({ item }: { item: ToneInfo }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item.number);
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
                  })}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: item.color,
                      marginRight: 10,
                    }}
                  />
                  <Text style={{ fontSize: 14, color: '#2C1A0E', flex: 1 }}>
                    เสียงที่ {item.number} — {item.name_th}
                  </Text>
                  {selected === item.number && (
                    <Ionicons name="checkmark" size={16} color="#C9A84C" />
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

export function ToneCompareSection({
  selectedTones,
  onSelectTone,
  onPlayCompare,
}: ToneCompareSectionProps) {
  const [a, b] = selectedTones;
  const toneA = a !== null ? TONES.find((t) => t.number === a) : null;
  const toneB = b !== null ? TONES.find((t) => t.number === b) : null;
  const isSame = a !== null && b !== null && a === b;
  const canPlay = a !== null && b !== null && !isSame;

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        padding: 16,
        marginTop: 16,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1A0E', marginBottom: 12 }}>
        เปรียบเทียบเสียง
      </Text>

      {/* Dropdowns */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TonePicker label="เสียงที่ 1" selected={a} onSelect={(n) => onSelectTone(0, n)} />
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#A08060' }}>VS</Text>
        <TonePicker label="เสียงที่ 2" selected={b} onSelect={(n) => onSelectTone(1, n)} />
      </View>

      {/* Same-tone warning */}
      {isSame && (
        <Text style={{ fontSize: 12, color: '#B5451B', marginTop: 8 }}>
          กรุณาเลือก 2 เสียงที่ต่างกัน
        </Text>
      )}

      {/* Comparison description */}
      {toneA && toneB && !isSame && (
        <Text style={{ fontSize: 13, color: '#6B4F2A', marginTop: 10, textAlign: 'center' }}>
          เสียงที่ {toneA.number} ({toneA.description_th}) vs เสียงที่ {toneB.number} (
          {toneB.description_th})
        </Text>
      )}

      {/* Play button */}
      <Pressable
        onPress={canPlay ? onPlayCompare : undefined}
        disabled={!canPlay}
        style={({ pressed }) => ({
          backgroundColor: canPlay ? '#B5451B' : '#D9C9A8',
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
          marginTop: 12,
          opacity: pressed ? 0.85 : 1,
        })}
        accessibilityRole="button"
        accessibilityLabel="เล่นเปรียบเทียบ"
      >
        <Text style={{ fontSize: 15, fontWeight: '600', color: canPlay ? '#FAF6EE' : '#A08060' }}>
          ▶ เล่นเปรียบเทียบ
        </Text>
      </Pressable>
    </View>
  );
}
