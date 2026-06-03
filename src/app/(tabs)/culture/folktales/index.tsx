import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_FOLKTALES, Folktale } from '../../../../data/mockFolktales';

export default function FolktalesScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: Folktale }) => (
    <Pressable
      onPress={() => router.push(`/culture/folktales/${item.id}`)}
      className="bg-white mx-5 my-2 p-4 rounded-xl shadow-sm border border-cream-200 active:bg-cream-50"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-lg font-bold text-brown-900 font-sarabun">{item.title}</Text>
          <Text className="text-sm text-brown-400 mt-1 font-sarabun" numberOfLines={2}>
            {item.description}
          </Text>
          <View className="flex-row mt-3 gap-2">
            {item.tags.map((tag) => (
              <View key={tag} className="bg-cream-100 px-2 py-1 rounded-md">
                <Text className="text-[10px] font-medium text-brown-400 font-sarabun">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="w-10 h-10 bg-gold-50 rounded-full items-center justify-center">
          <Ionicons name="play" size={18} color="#C9A84C" />
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <View className="px-5 pt-4 pb-2 flex-row items-center gap-2">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-cream-100"
        >
          <Ionicons name="chevron-back" size={24} color="#2C1A0E" />
        </Pressable>
        <Text className="text-2xl font-bold text-brown-900 font-sarabun">นิทานและสุภาษิต</Text>
      </View>

      <FlatList
        data={MOCK_FOLKTALES}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
