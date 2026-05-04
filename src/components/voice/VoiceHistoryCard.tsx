import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ConfidenceMini } from './ConfidenceBar';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import type { VoiceHistoryEntry } from '../../types/voice';

interface VoiceHistoryCardProps {
  entry: VoiceHistoryEntry;
  onPress: () => void;
  onShare: () => void;
}

export function VoiceHistoryCard({ entry, onPress, onShare }: VoiceHistoryCardProps) {
  const { result } = entry;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#EDE0C4' : '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 76,
      })}
      accessibilityLabel={`${entry.transcript || '—'} แปลว่า ${result.teochew_char ?? '—'}`}
      accessibilityRole="button"
      accessibilityHint="กดเพื่อดูผลการถอดเสียงอีกครั้ง"
    >
      {/* Top row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginRight: 8 }}
        >
          <Ionicons name="mic-outline" size={16} color="#A08060" />
          <Text
            style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#2C1A0E' }}
            numberOfLines={1}
          >
            {entry.transcript || '—'}
          </Text>
        </View>
        <Pressable
          onPress={onShare}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
          accessibilityLabel="แชร์รายการนี้"
          accessibilityRole="button"
        >
          <Ionicons name="share-outline" size={16} color="#A08060" />
        </Pressable>
      </View>

      {/* Result row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1A0E' }} numberOfLines={1}>
          {result.teochew_char ?? '—'}
        </Text>
        {result.pengim && (
          <Text style={{ fontSize: 13, fontStyle: 'italic', color: '#9A7A2E' }}>
            ({result.pengim})
          </Text>
        )}
      </View>

      {/* Meta row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <ConfidenceMini confidence={result.confidence} />
        <Text style={{ fontSize: 11, color: '#D9C9A8' }}>·</Text>
        <Text style={{ fontSize: 11, color: '#A08060' }}>
          {formatRelativeTime(entry.recorded_at)}
        </Text>
        {!result.verified && (
          <>
            <Text style={{ fontSize: 11, color: '#D9C9A8' }}>·</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="warning-outline" size={10} color="#9A7A2E" />
              <Text style={{ fontSize: 11, color: '#9A7A2E' }}>ยังไม่ยืนยัน</Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}
