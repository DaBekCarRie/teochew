import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCultureStore } from '../../../stores/cultureStore';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_H = 300;

const CATEGORY_LABEL: Record<string, string> = {
  festival: 'เทศกาล & ประเพณี',
  food: 'อาหารแต้จิ๋ว',
  wedding: 'พิธีมงคล',
  religion: 'ความเชื่อ & ศาสนา',
  tradition: 'ประเพณีชีวิตประจำวัน',
};

export default function CultureArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { articles } = useCultureStore();
  const article = articles.find((a) => a.id === id);

  const [isPlaying, setIsPlaying] = useState(false);

  if (!article) {
    return (
      <View style={[styles.notFound, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>ไม่พบบทความ</Text>
        <Pressable onPress={() => router.back()} style={styles.notFoundBtn}>
          <Text style={styles.notFoundBtnText}>กลับ</Text>
        </Pressable>
      </View>
    );
  }

  const categoryLabel = CATEGORY_LABEL[article.category] ?? article.category;
  const readMinutes = article.read_minutes ?? 5;

  const now = new Date();
  const articleDate = `อัปเดต ${now.toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}`;

  return (
    <View style={styles.screen}>
      {/* Hero image */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: article.cover_image_url }}
          style={styles.heroImage}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />

        {/* Gradient overlay */}
        <View style={styles.heroGradient} />

        {/* Nav buttons */}
        <View style={[styles.navRow, { marginTop: insets.top + 8 }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.7 : 1 }]}>
            <Ionicons name="arrow-up-circle-outline" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Hero title overlay */}
        <View style={styles.heroOverlay}>
          {/* Category badge */}
          <View style={styles.categoryBadge}>
            <View style={styles.categoryDot} />
            <Text style={styles.categoryLabel}>{categoryLabel}</Text>
          </View>

          <Text style={styles.heroTitle}>{article.title_th}</Text>

          <Text style={styles.heroSubtitle}>
            {[article.title_en, article.title_teochew_char, article.title_teochew_pengim]
              .filter(Boolean)
              .join(' · ')}
          </Text>

          <Text style={styles.heroMeta}>
            {readMinutes} นาที · {articleDate}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro paragraph */}
        <Text style={styles.bodyText}>{article.content_th}</Text>

        {/* Meaning section */}
        {article.meaning_label && article.meaning_th && (
          <>
            <Text style={styles.sectionHeader}>{article.meaning_label}</Text>
            <Text style={styles.bodyText}>{article.meaning_th}</Text>
          </>
        )}

        {/* Vocabulary box */}
        {article.vocab && article.vocab.length > 0 && (
          <View style={styles.vocabBox}>
            <Text style={styles.vocabBoxLabel}>คำที่เกี่ยวข้อง</Text>
            <View style={styles.vocabChips}>
              {article.vocab.map((item) => (
                <View key={item.char} style={styles.vocabChip}>
                  <Text style={styles.vocabChar}>{item.char}</Text>
                  <Text style={styles.vocabThai}>{item.thai}</Text>
                  <Text style={styles.vocabPengim}>{item.pengim}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Customs section */}
        {article.customs_label && article.customs_th && (
          <>
            <Text style={styles.sectionHeader}>{article.customs_label}</Text>
            <Text style={styles.bodyText}>{article.customs_th}</Text>
          </>
        )}
      </ScrollView>

      {/* Audio player bar */}
      <View style={[styles.audioPlayer, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable onPress={() => setIsPlaying((v) => !v)} style={styles.audioPlayBtn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.audioInfo}>
          <Text style={styles.audioTitle}>ฟังบทความ</Text>
          <Text style={styles.audioDuration}>
            {readMinutes}:{String(Math.floor(readMinutes * 0.6)).padStart(2, '0')} · เสียงผู้บรรยาย
          </Text>
        </View>

        <Pressable style={styles.audioSpeed}>
          <Text style={styles.audioSpeedText}>1.0x</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  notFound: {
    flex: 1,
    backgroundColor: '#FAF6EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#7C4B35',
    fontFamily: 'Sarabun',
  },
  notFoundBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#EAD9B8',
    borderRadius: 10,
  },
  notFoundBtnText: {
    fontFamily: 'Sarabun',
    fontSize: 15,
    color: '#2C1A0E',
  },

  // Hero
  heroContainer: {
    width: SCREEN_W,
    height: HERO_H,
    position: 'relative',
  },
  heroImage: {
    width: SCREEN_W,
    height: HERO_H,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HERO_H * 0.75,
    backgroundColor: 'transparent',
  },
  navRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingTop: 32,
    gap: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoryDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Sarabun',
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Sarabun',
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#C9A84C',
    fontFamily: 'Sarabun',
    letterSpacing: 0.2,
  },
  heroMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'Sarabun',
    marginTop: 2,
  },

  // Content
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    gap: 0,
  },
  bodyText: {
    fontSize: 16,
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    lineHeight: 28,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    marginBottom: 10,
    marginTop: 4,
  },

  // Vocab box
  vocabBox: {
    backgroundColor: '#FAF6EE',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDE0C4',
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  vocabBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A08060',
    fontFamily: 'Sarabun',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  vocabChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vocabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EDE0C4',
  },
  vocabChar: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C1A0E',
    lineHeight: 22,
  },
  vocabThai: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  vocabPengim: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#C9A84C',
    fontWeight: '500',
  },

  // Audio player
  audioPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2C1A0E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 14,
  },
  audioPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B5451B',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  audioInfo: {
    flex: 1,
    gap: 2,
  },
  audioTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Sarabun',
  },
  audioDuration: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'Sarabun',
  },
  audioSpeed: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  audioSpeedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Sarabun',
  },
});
