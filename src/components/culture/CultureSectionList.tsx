import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { CultureArticle } from '../../stores/cultureStore';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { key: 'festival', label: 'เทศกาล & ประเพณี', color: '#B5451B' },
  { key: 'food', label: 'อาหารแต้จิ๋ว', color: '#9A7A2E' },
  { key: 'wedding', label: 'พิธีมงคล', color: '#B5451B' },
  { key: 'religion', label: 'ความเชื่อ & ศาสนา', color: '#6B4C2A' },
  { key: 'tradition', label: 'ประเพณีชีวิตประจำวัน', color: '#9A7A2E' },
];

interface Props {
  articles: CultureArticle[];
  filter?: string; // 'all' or category key
}

export function CultureSectionList({ articles, filter = 'all' }: Props) {
  const router = useRouter();

  const categoriesToShow =
    filter === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.key === filter);

  return (
    <View style={styles.container}>
      {categoriesToShow.map((cat) => {
        const catArticles = articles.filter((a) => a.category === cat.key);
        if (catArticles.length === 0) return null;

        return (
          <View key={cat.key} style={styles.section}>
            {/* Section header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{cat.label}</Text>
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                <Text style={[styles.seeAll, { color: cat.color }]}>ทั้งหมด →</Text>
              </Pressable>
            </View>

            {/* Horizontal scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {catArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onPress={() => router.push(`/culture/${article.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}

function ArticleCard({ article, onPress }: { article: CultureArticle; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.88 : 1 }]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: article.cover_image_url }}
          style={styles.image}
          contentFit="cover"
          transition={250}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {article.title_th}
        </Text>
        {article.title_en && (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {article.title_en}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Sarabun',
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  card: {
    width: 176,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapper: {
    width: 176,
    height: 120,
    backgroundColor: '#F5EDD9',
  },
  image: {
    width: 176,
    height: 120,
  },
  cardBody: {
    padding: 12,
    paddingTop: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#A08060',
    fontFamily: 'Sarabun',
    marginTop: 2,
  },
});
