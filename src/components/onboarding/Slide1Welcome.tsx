import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAudioPlayer } from 'expo-audio';

export function Slide1Welcome() {
  function handlePlayTTS() {
    try {
      const player = createAudioPlayer({
        uri: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2910d655f2.mp3',
      });
      player.play();
      // It will play and we don't strictly need to manually remove it for a placeholder,
      // but ideally we should listen for finish.
      player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          try {
            player.remove();
          } catch {}
        }
      });
    } catch (e) {
      console.log('TTS failed', e);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
      <Text style={{ fontSize: 96, textAlign: 'center', marginBottom: 24 }}>🏮</Text>

      <Text style={{ fontSize: 18, color: '#7C4B35', textAlign: 'center', fontFamily: 'Sarabun' }}>
        ยินดีต้อนรับสู่
      </Text>
      <Text
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: '#2C1A0E',
          textAlign: 'center',
          marginTop: 4,
        }}
      >
        Teochew
      </Text>

      <View style={{ height: 1, backgroundColor: '#D9C9A8', marginVertical: 32 }} />

      <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#2C1A0E', textAlign: 'center' }}>
        汝好
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontStyle: 'italic',
          color: '#B8860B',
          textAlign: 'center',
          marginTop: 4,
        }}
      >
        le2 ho2
      </Text>

      <Pressable
        onPress={handlePlayTTS}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 16,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Ionicons name="volume-medium" size={18} color="#C9A84C" />
        <Text style={{ fontSize: 14, color: '#B8860B', fontFamily: 'Sarabun' }}>กดฟังเสียง</Text>
      </Pressable>

      <View style={{ height: 1, backgroundColor: '#D9C9A8', marginVertical: 32 }} />

      <Text style={{ fontSize: 14, color: '#9E7B6B', textAlign: 'center', fontFamily: 'Sarabun' }}>
        รองรับ 4 ภาษา
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 12 }}>
        <LangItem icon="🇹🇭" label="ไทย" />
        <LangItem icon="🇨🇳" label="จีนกลาง" />
        <LangItem icon="🏮" label="แต้จิ๋ว" />
        <LangItem icon="🇬🇧" label="อังกฤษ" />
      </View>
    </View>
  );
}

function LangItem({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text style={{ fontSize: 12, color: '#7C4B35', fontFamily: 'Sarabun' }}>{label}</Text>
    </View>
  );
}
