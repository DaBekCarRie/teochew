import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MapRegion } from '../../data/mockMap';

interface MapPinProps {
  region: MapRegion;
  onPress: (region: MapRegion) => void;
}

export function MapPin({ region, onPress }: MapPinProps) {
  return (
    <Pressable
      onPress={() => onPress(region)}
      className="absolute items-center justify-center -ml-4 -mt-4 active:opacity-70"
      style={{ left: `${region.x}%`, top: `${region.y}%` }}
    >
      <Ionicons name="location" size={32} color="#B5451B" />
      <View className="bg-white/90 px-2 py-0.5 rounded-full border border-brown-200 mt-1 shadow-sm">
        <Text className="text-[10px] font-bold text-brown-900 font-sarabun">
          {region.name_th.split(' ')[0]}
        </Text>
      </View>
    </Pressable>
  );
}
