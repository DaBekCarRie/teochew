import React from 'react';
import { View, Text, Pressable, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import type { TranscribeResponse } from '../../types/voice';
import { buildVoiceShareMessage, buildVoiceCopyText } from '../../utils/voiceFormatters';

const LANG_TABS = [
  { lang: 'th' as const, flag: '🇹🇭', label: 'ภาษาไทย' },
  { lang: 'zh' as const, flag: '🇨🇳', label: 'จีนกลาง' },
  { lang: 'en' as const, flag: '🇬🇧', label: 'ภาษาอังกฤษ' },
];

interface VoiceResultCardProps {
  result: TranscribeResponse;
  selectedLang: 'th' | 'zh' | 'en';
  onSelectLang: (lang: 'th' | 'zh' | 'en') => void;
  onShowCorrection?: () => void;
}

export function VoiceResultCard({
  result,
  selectedLang,
  onSelectLang,
  onShowCorrection,
}: VoiceResultCardProps) {
  const [copied, setCopied] = React.useState(false);

  const meaningMap: Record<'th' | 'zh' | 'en', string | null> = {
    th: result.thai_meaning,
    zh: result.mandarin_char,
    en: result.english_meaning,
  };

  async function handleCopy() {
    await Clipboard.setStringAsync(buildVoiceCopyText(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleShare() {
    await Share.share({ message: buildVoiceShareMessage(result) });
  }

  const otherLangs = LANG_TABS.filter((t) => t.lang !== selectedLang);

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 16,
        padding: 20,
        marginTop: 4,
      }}
    >
      {!result.verified && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(201,168,76,0.15)',
            borderWidth: 1,
            borderColor: '#C9A84C',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginBottom: 12,
            alignSelf: 'flex-start',
          }}
        >
          <Ionicons name="warning-outline" size={13} color="#9A7A2E" />
          <Text style={{ fontSize: 11, color: '#9A7A2E', fontWeight: '500' }}>ยังไม่ยืนยัน</Text>
        </View>
      )}

      <Text
        style={{
          fontSize: 40,
          fontWeight: '700',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        {result.teochew_char ?? '—'}
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontStyle: 'italic',
          color: '#9A7A2E',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        {result.pengim ?? '—'}
      </Text>

      {/* Lang tabs */}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
        {LANG_TABS.map((tab) => (
          <Pressable
            key={tab.lang}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelectLang(tab.lang);
            }}
            style={({ pressed }) => ({
              flex: 1,
              maxWidth: 80,
              paddingVertical: 8,
              borderRadius: 999,
              alignItems: 'center',
              backgroundColor: selectedLang === tab.lang ? '#B5451B' : '#EDE0C4',
              opacity: pressed ? 0.85 : 1,
            })}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedLang === tab.lang }}
          >
            <Text style={{ fontSize: 18 }}>{tab.flag}</Text>
          </Pressable>
        ))}
      </View>

      {/* Selected meaning */}
      <View style={{ minHeight: 72, justifyContent: 'center', paddingVertical: 8 }}>
        <Text
          style={{ fontSize: 28, fontWeight: '700', color: '#2C1A0E', textAlign: 'center' }}
          accessibilityLabel={`${LANG_TABS.find((t) => t.lang === selectedLang)?.label}: ${meaningMap[selectedLang] ?? '—'}`}
        >
          {meaningMap[selectedLang] ?? '—'}
        </Text>
      </View>

      {/* Other langs */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {otherLangs.map((tab, i) => (
          <React.Fragment key={tab.lang}>
            {i > 0 && <Text style={{ fontSize: 12, color: '#D9C9A8' }}>·</Text>}
            <Text style={{ fontSize: 13, color: '#A08060' }}>
              {tab.flag} {meaningMap[tab.lang] ?? '—'}
            </Text>
          </React.Fragment>
        ))}
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#D9C9A8', marginBottom: 16 }} />

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => ({
            flex: 1,
            height: 44,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#D9C9A8',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons
            name={copied ? 'checkmark-circle-outline' : 'copy-outline'}
            size={16}
            color={copied ? '#4A7C59' : '#6B4C2A'}
          />
          <Text style={{ fontSize: 13, color: copied ? '#4A7C59' : '#6B4C2A' }}>
            {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleShare}
          style={({ pressed }) => ({
            flex: 1,
            height: 44,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#D9C9A8',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons name="share-outline" size={16} color="#6B4C2A" />
          <Text style={{ fontSize: 13, color: '#6B4C2A' }}>แชร์</Text>
        </Pressable>
      </View>

      {!result.verified && onShowCorrection && (
        <Pressable
          onPress={onShowCorrection}
          style={({ pressed }) => ({
            marginTop: 12,
            height: 40,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#C9A84C',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 6,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons name="create-outline" size={14} color="#9A7A2E" />
          <Text style={{ fontSize: 13, color: '#9A7A2E' }}>แก้ไข / ส่งคำที่ถูกต้อง</Text>
        </Pressable>
      )}
    </View>
  );
}
