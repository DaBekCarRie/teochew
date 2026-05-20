import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WordOfDay } from '../../stores/cultureStore';
import { createAudioPlayer } from 'expo-audio';
import { usePlaybackSpeed } from '../../hooks/usePlaybackSpeed';
import * as Haptics from 'expo-haptics';

export function WordOfDayCard({ wordOfDay }: { wordOfDay: WordOfDay }) {
  const { word } = wordOfDay;
  const playbackSpeed = usePlaybackSpeed();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlayTTS() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const uri =
        word.teochew_audio || 'https://cdn.pixabay.com/audio/2022/03/15/audio_2910d655f2.mp3';
      const player = createAudioPlayer({ uri });
      player.setPlaybackRate(playbackSpeed, 'high');
      player.play();
      setIsPlaying(true);
      player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          try {
            player.remove();
          } catch {}
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.log('TTS failed', e);
      setIsPlaying(false);
    }
  }

  function handleBookmark() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsBookmarked((v) => !v);
  }

  return (
    <View style={styles.card}>
      {/* Badge */}
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>คำประจำวัน</Text>
      </View>

      {/* Main row */}
      <View style={styles.mainRow}>
        <View style={styles.charBlock}>
          <Text style={styles.character}>{word.teochew_char}</Text>
          <Text style={styles.pengim}>{word.teochew_pengim}</Text>
        </View>

        <View style={styles.meaningsBlock}>
          {word.thai_meaning && <Text style={styles.thaiMeaning}>{word.thai_meaning}</Text>}
          {word.english_meaning && (
            <Text style={styles.englishMeaning}>{word.english_meaning}</Text>
          )}
        </View>
      </View>

      {/* Actions — NA-safe wrapper pattern */}
      <View style={styles.actions}>
        <View style={styles.btnPlayWrap}>
          <Pressable
            onPress={handlePlayTTS}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View style={styles.btnPlay}>
              <Ionicons
                name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.btnPlayText}>{isPlaying ? 'กำลังเล่น…' : 'ฟัง'}</Text>
            </View>
          </Pressable>
        </View>

        <View>
          <Pressable
            onPress={handleBookmark}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View style={[styles.btnBookmark, isBookmarked && styles.btnBookmarkActive]}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? '#FFFFFF' : '#C9A84C'}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 5,
    padding: 16,
    gap: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF0EB',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B5451B',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B5451B',
    fontFamily: 'Sarabun',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  charBlock: {
    width: 96,
    backgroundColor: '#FAF6EE',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDE0C4',
    flexShrink: 0,
    paddingVertical: 14,
    gap: 4,
  },
  character: {
    fontSize: 52,
    fontWeight: '800',
    color: '#2C1A0E',
    lineHeight: 58,
    textAlign: 'center',
  },
  pengim: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#C9A84C',
    textAlign: 'center',
  },
  meaningsBlock: {
    flex: 1,
    gap: 3,
  },
  thaiMeaning: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    lineHeight: 34,
  },
  englishMeaning: {
    fontSize: 14,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnPlayWrap: {
    flex: 1,
  },
  btnPlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#B5451B',
    borderRadius: 12,
    paddingVertical: 11,
  },
  btnPlayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Sarabun',
  },
  btnBookmark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C9A84C',
  },
  btnBookmarkActive: {
    backgroundColor: '#C9A84C',
    borderColor: '#C9A84C',
  },
});
