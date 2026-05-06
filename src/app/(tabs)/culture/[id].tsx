import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCultureStore } from '../../../stores/cultureStore';

export default function CultureArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { articles } = useCultureStore();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FAF6EE',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, color: '#7C4B35', fontFamily: 'Sarabun' }}>ไม่พบบทความ</Text>
        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 16, padding: 12, backgroundColor: '#EAD9B8', borderRadius: 8 }}
        >
          <Text style={{ fontFamily: 'Sarabun' }}>กลับ</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#D9C9A8',
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#2C1A0E" />
        </Pressable>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2C1A0E',
            fontFamily: 'Sarabun',
            marginLeft: 8,
          }}
        >
          บทความ
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <Image
          source={{ uri: article.cover_image_url }}
          style={{ width: '100%', height: 240 }}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />

        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#2C1A0E',
              fontFamily: 'Sarabun',
              marginBottom: 16,
            }}
          >
            {article.title_th}
          </Text>
          <Text style={{ fontSize: 16, color: '#2C1A0E', fontFamily: 'Sarabun', lineHeight: 28 }}>
            {article.content_th}
          </Text>
        </View>

        {article.related_words.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 16, marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#2C1A0E',
                fontFamily: 'Sarabun',
                marginBottom: 12,
              }}
            >
              คำศัพท์ที่เกี่ยวข้อง
            </Text>
            {/* Will render WordCards here using Dictionary components if needed */}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
