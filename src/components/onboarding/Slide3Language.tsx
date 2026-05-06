import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface Slide3LanguageProps {
  selectedLang: 'th' | 'zh' | 'en';
  onSelect: (lang: 'th' | 'zh' | 'en') => void;
}

export function Slide3Language({ selectedLang, onSelect }: Slide3LanguageProps) {
  function handleSelect(lang: 'th' | 'zh' | 'en') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(lang);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
      <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🌐</Text>

      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: '#2C1A0E',
          textAlign: 'center',
          marginBottom: 32,
          fontFamily: 'Sarabun',
          lineHeight: 32,
        }}
      >
        คุณต้องการดูความหมาย{'\n'}เป็นภาษาอะไร?
      </Text>

      <View style={{ gap: 12 }}>
        <LanguageOption
          flag="🇹🇭"
          title="ภาษาไทย"
          subtitle="ความหมายจะแสดงเป็นไทยเป็นหลัก"
          isSelected={selectedLang === 'th'}
          onPress={() => handleSelect('th')}
        />
        <LanguageOption
          flag="🇬🇧"
          title="English"
          subtitle="Meanings shown in English"
          isSelected={selectedLang === 'en'}
          onPress={() => handleSelect('en')}
        />
        <LanguageOption
          flag="🇨🇳"
          title="普通话 / Mandarin"
          subtitle="以普通话显示释义"
          isSelected={selectedLang === 'zh'}
          onPress={() => handleSelect('zh')}
        />
      </View>

      <Text
        style={{
          fontSize: 12,
          color: '#A08060',
          textAlign: 'center',
          marginTop: 24,
          fontFamily: 'Sarabun',
        }}
      >
        สามารถเปลี่ยนได้ภายหลังใน Settings
      </Text>
    </View>
  );
}

interface LanguageOptionProps {
  flag: string;
  title: string;
  subtitle: string;
  isSelected: boolean;
  onPress: () => void;
}

function LanguageOption({ flag, title, subtitle, isSelected, onPress }: LanguageOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 14,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? '#C9A84C' : '#D9C9A8',
        backgroundColor: isSelected ? '#E8D5A3' : '#F5EDD9',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        <Text style={{ fontSize: 24 }}>{flag}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 16, fontWeight: '600', color: '#2C1A0E', fontFamily: 'Sarabun' }}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 12, color: '#7C4B35', fontFamily: 'Sarabun', marginTop: 2 }}>
            {subtitle}
          </Text>
        </View>
      </View>

      {isSelected && <Ionicons name="checkmark-circle" size={24} color="#9A7A2E" />}
    </Pressable>
  );
}
