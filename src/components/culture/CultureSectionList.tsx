import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { CultureArticle } from '../../stores/cultureStore';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { key: 'festival', icon: '🎆', label: 'เทศกาล & ประเพณี' },
  { key: 'food', icon: '🍜', label: 'อาหารแต้จิ๋ว' },
  { key: 'wedding', icon: '🧧', label: 'พิธีมงคล' },
  { key: 'religion', icon: '🙏', label: 'ความเชื่อ & ศาสนา' },
  { key: 'tradition', icon: '🥢', label: 'ประเพณีชีวิตประจำวัน' },
];

export function CultureSectionList({ articles }: { articles: CultureArticle[] }) {
  const router = useRouter();

  return (
    <View style={{ marginTop: 24 }}>
      {CATEGORIES.map((cat) => {
        const catArticles = articles.filter((a) => a.category === cat.key);
        if (catArticles.length === 0) return null;

        return (
          <View key={cat.key} style={{ marginBottom: 32 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 20 }}>{cat.icon}</Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#2C1A0E',
                    fontFamily: 'Sarabun',
                  }}
                >
                  {cat.label}
                </Text>
              </View>
              <Pressable>
                <Text style={{ fontSize: 14, color: '#B8860B', fontFamily: 'Sarabun' }}>
                  ดูทั้งหมด →
                </Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
            >
              {catArticles.map((article) => (
                <Pressable
                  key={article.id}
                  onPress={() => router.push(`/culture/${article.id}`)}
                  style={{ marginRight: 12, width: 160 }}
                >
                  <View
                    style={{ borderRadius: 14, overflow: 'hidden', backgroundColor: '#F5EDD9' }}
                  >
                    <Image
                      source={{ uri: article.cover_image_url }}
                      style={{ width: 160, height: 110 }}
                      contentFit="cover"
                      transition={200}
                      placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#2C1A0E',
                      marginTop: 8,
                      fontFamily: 'Sarabun',
                    }}
                  >
                    {article.title_th}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}
