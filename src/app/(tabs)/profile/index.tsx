import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Application from 'expo-application';
import { useXPStore } from '../../../stores/xpStore';
import { useStreakStore } from '../../../stores/streakStore';
import { useUserStore } from '../../../stores/userStore';
import { useProgressStore } from '../../../stores/progressStore';
import { FeedbackModal } from '../../../components/profile/FeedbackModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { totalXP, getLevelDef, getXPWithinCurrentLevel, getXPToNextLevel } = useXPStore();
  const { streak } = useStreakStore();
  const { notifEnabled, setNotifEnabled, logout } = useUserStore();
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const levelDef = getLevelDef();
  const currentXPInLevel = getXPWithinCurrentLevel();
  const xpToNext = getXPToNextLevel();
  const progressPercent = Math.min(100, Math.max(0, (currentXPInLevel / xpToNext) * 100));

  const handleReset = () => {
    Alert.alert(
      'ล้างข้อมูลทั้งหมด',
      'ข้อมูลการเรียนรู้, คำศัพท์ที่บันทึก, เลเวล, และการตั้งค่าจะถูกลบทั้งหมด คุณแน่ใจหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ล้างข้อมูล',
          style: 'destructive',
          onPress: async () => {
            // Reset all Zustand stores that persist data
            await useProgressStore.getState().reset();
            await useXPStore.getState().reset();
            await useStreakStore.getState().reset();
            await logout(); // clears AsyncStorage entirely

            Alert.alert('สำเร็จ', 'ข้อมูลถูกล้างเรียบร้อยแล้ว', [
              { text: 'ตกลง', onPress: () => router.replace('/') },
            ]);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-cream-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-brown-900 font-sarabun">โปรไฟล์</Text>
        </View>

        {/* User Stats Card */}
        <View className="mx-6 p-5 bg-white rounded-2xl border border-cream-200 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-sm font-medium text-brown-400 font-sarabun">เลเวลปัจจุบัน</Text>
              <Text className="text-2xl font-bold text-brown-900 font-sarabun">
                {levelDef.level} {levelDef.nameTh}
              </Text>
            </View>
            <View className="w-12 h-12 rounded-full bg-cream-100 items-center justify-center">
              <Text className="text-2xl">🏮</Text>
            </View>
          </View>

          <View className="h-2 bg-cream-100 rounded-full mb-2 overflow-hidden">
            <View
              className="h-full bg-gold-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-brown-400 font-sarabun">{currentXPInLevel} XP</Text>
            <Text className="text-xs text-brown-400 font-sarabun">{xpToNext} XP</Text>
          </View>

          <View className="flex-row mt-6 pt-4 border-t border-cream-100">
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-brown-900">{totalXP}</Text>
              <Text className="text-xs text-brown-400 font-sarabun">XP ทั้งหมด</Text>
            </View>
            <View className="w-px bg-cream-100" />
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-brown-900">{streak.currentStreak} 🔥</Text>
              <Text className="text-xs text-brown-400 font-sarabun">สตรีค</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="px-6">
          <Text className="text-lg font-bold text-brown-900 font-sarabun mb-3">
            การตั้งค่าและช่วยเหลือ
          </Text>

          <View className="bg-white rounded-2xl border border-cream-200 shadow-sm mb-6 overflow-hidden">
            {/* Notification Toggle */}
            <View className="flex-row items-center justify-between p-4 border-b border-cream-100">
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-8 h-8 rounded-full bg-cream-50 items-center justify-center mr-3">
                  <Ionicons name="notifications" size={18} color="#A08060" />
                </View>
                <View>
                  <Text className="text-base font-semibold text-brown-900 font-sarabun">
                    การแจ้งเตือน
                  </Text>
                  <Text className="text-xs text-brown-400 font-sarabun">คำศัพท์ประจำวัน</Text>
                </View>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: '#D9C9A8', true: '#B5451B' }}
                thumbColor="#FAF6EE"
              />
            </View>

            {/* Feedback Button */}
            <Pressable
              onPress={() => setFeedbackVisible(true)}
              className="flex-row items-center p-4 border-b border-cream-100 active:bg-cream-50"
            >
              <View className="w-8 h-8 rounded-full bg-cream-50 items-center justify-center mr-3">
                <Ionicons name="chatbubble-ellipses" size={18} color="#A08060" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-brown-900 font-sarabun">
                  ส่งข้อเสนอแนะ
                </Text>
                <Text className="text-xs text-brown-400 font-sarabun">
                  แจ้งปัญหาหรือแนะนำฟีเจอร์
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D9C9A8" />
            </Pressable>

            {/* Reset Data */}
            <Pressable
              onPress={handleReset}
              className="flex-row items-center p-4 active:bg-cream-50"
            >
              <View className="w-8 h-8 rounded-full bg-cream-50 items-center justify-center mr-3">
                <Ionicons name="trash" size={18} color="#B5451B" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-brick-600 font-sarabun">
                  รีเซ็ตข้อมูลทั้งหมด
                </Text>
                <Text className="text-xs text-brown-400 font-sarabun">
                  สำหรับผู้ทดสอบ Beta Test
                </Text>
              </View>
            </Pressable>
          </View>

          <Text className="text-center text-xs text-brown-400 font-sarabun mt-2">
            Teochew App v{Application.nativeApplicationVersion || '1.0.0'}
          </Text>
        </View>

        <FeedbackModal visible={feedbackVisible} onClose={() => setFeedbackVisible(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}
