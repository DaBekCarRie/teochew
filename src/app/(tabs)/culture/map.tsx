import React, { useRef, useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { CHAOSHAN_REGIONS, MapRegion } from '../../../data/mockMap';
import { MapPin } from '../../../components/culture/MapPin';

export default function CultureMapScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);

  const handlePinPress = (region: MapRegion) => {
    setSelectedRegion(region);
    bottomSheetRef.current?.expand();
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-100" edges={['top', 'left', 'right']}>
      <View className="px-5 pt-4 pb-2 flex-row items-center gap-2 z-10 bg-cream-100 shadow-sm">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-cream-200"
        >
          <Ionicons name="chevron-back" size={24} color="#2C1A0E" />
        </Pressable>
        <Text className="text-lg font-bold text-brown-900 font-sarabun flex-1">
          แผนที่ 8 แขวงแต้จิ๋ว
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ width: '100%', height: 1000, position: 'relative' }}
        maximumZoomScale={3}
        minimumZoomScale={1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Image
          source="https://placehold.co/800x1000/F5EDD8/C9A84C?text=Chaoshan+Map"
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />

        <View className="absolute inset-0">
          {CHAOSHAN_REGIONS.map((region) => (
            <MapPin key={region.id} region={region} onPress={handlePinPress} />
          ))}
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#FAF6EE' }}
        handleIndicatorStyle={{ backgroundColor: '#D9C9A8' }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-6">
          {selectedRegion ? (
            <>
              <Text className="text-2xl font-bold text-brown-900 font-sarabun mb-1">
                {selectedRegion.name_th}
              </Text>
              <View className="flex-row items-center gap-2 mb-4">
                <Text className="text-sm font-bold text-brown-600">{selectedRegion.name_zh}</Text>
                <Text className="text-xs italic text-gold-600">{selectedRegion.name_tc}</Text>
              </View>

              <Text className="text-sm text-brown-800 font-sarabun leading-6 mb-4">
                {selectedRegion.description}
              </Text>

              <View className="bg-white rounded-xl p-3 border border-cream-200 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-gold-50 items-center justify-center">
                  <Ionicons name="restaurant" size={18} color="#C9A84C" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">
                    ของกินขึ้นชื่อ
                  </Text>
                  <Text className="text-sm font-bold text-brown-900 font-sarabun">
                    {selectedRegion.famous_food}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text className="text-center text-brown-400 mt-10 font-sarabun">
              เลือกเมืองบนแผนที่เพื่อดูข้อมูล
            </Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
