import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore, AppLanguage, PlaybackSpeed } from '../../../stores/userStore';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import * as Application from 'expo-application';
import * as Linking from 'expo-linking';
import { useCultureStore } from '../../../stores/cultureStore';
import { FeedbackModal } from '../../../components/profile/FeedbackModal';
import { useTheme } from '../../../utils/theme';

import type { AppColors } from '../../../utils/theme';

const LANG_LABELS: Record<AppLanguage, string> = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
};

const SPEED_LABELS: Record<PlaybackSpeed, string> = {
  '0.75': '0.75x — ช้า',
  '1.0': '1.0x — ปกติ',
  '1.25': '1.25x — เร็ว',
  '1.5': '1.5x — เร็วมาก',
};

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [showFeedback, setShowFeedback] = useState(false);
  const {
    language,
    setLanguage,
    playbackSpeed,
    setPlaybackSpeed,
    notifEnabled,
    setNotifEnabled,
    notifTime,
    setNotifTime,
    clearCache,
    logout,
  } = useUserStore();
  const { scheduleDailyNotification } = useCultureStore();

  async function handleNotifToggle(enabled: boolean) {
    Haptics.impactAsync(
      enabled ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
    );

    if (enabled) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'ไม่สามารถเปิดการแจ้งเตือนได้',
            'กรุณาเปิดสิทธิ์การแจ้งเตือนในการตั้งค่าของอุปกรณ์',
            [
              { text: 'ยกเลิก', style: 'cancel' },
              { text: 'ไปที่การตั้งค่า', onPress: () => Linking.openSettings() },
            ],
          );
          return; // abort enabling
        }
      }
      await scheduleDailyNotification(notifTime, true);
    } else {
      await scheduleDailyNotification(notifTime, false);
    }

    setNotifEnabled(enabled);
  }

  function handleClearCache() {
    Alert.alert('ล้างแคช?', 'ข้อมูลที่ดาวน์โหลดจะถูกลบ แต่บัญชีและประวัติยังคงอยู่', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ล้างแคช',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await clearCache();
          Alert.alert('สำเร็จ', 'ล้างแคชเรียบร้อยแล้ว');
        },
      },
    ]);
  }

  function handleLogout() {
    Alert.alert('ออกจากระบบ', 'คุณแน่ใจหรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ออกจากระบบ',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
          router.replace('/(auth)/login'); // Optional if auth is handled
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <FeedbackModal visible={showFeedback} onClose={() => setShowFeedback(false)} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            fontFamily: 'Sarabun',
            marginLeft: 8,
          }}
        >
          ตั้งค่า
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingVertical: 24 }}>
          <SettingsSection title="ทั่วไป" colors={colors}>
            <SettingsRow
              icon="🌐"
              label="ภาษาหลัก"
              value={LANG_LABELS[language]}
              colors={colors}
              onPress={() => {
                const next: Record<AppLanguage, AppLanguage> = { th: 'en', en: 'zh', zh: 'th' };
                setLanguage(next[language]);
              }}
            />
            <SettingsRow
              icon="🔊"
              label="ความเร็วเสียง"
              value={SPEED_LABELS[playbackSpeed]}
              colors={colors}
              onPress={() => {
                const next: Record<PlaybackSpeed, PlaybackSpeed> = {
                  '0.75': '1.0',
                  '1.0': '1.25',
                  '1.25': '1.5',
                  '1.5': '0.75',
                };
                setPlaybackSpeed(next[playbackSpeed]);
              }}
            />
          </SettingsSection>

          <SettingsSection title="การแจ้งเตือน" colors={colors}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: colors.white,
                borderBottomWidth: 1,
                borderBottomColor: colors.surface,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 20 }}>🔔</Text>
                <Text style={{ fontSize: 16, color: colors.text, fontFamily: 'Sarabun' }}>
                  แจ้งเตือนคำศัพท์
                </Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={handleNotifToggle}
                trackColor={{ false: colors.border, true: colors.gold }}
                thumbColor={notifEnabled ? '#E8D5A3' : '#FEFAF5'}
              />
            </View>

            {notifEnabled && (
              <SettingsRow
                icon="⏰"
                label="เวลาแจ้งเตือน"
                value={notifTime}
                colors={colors}
                onPress={() => {
                  Alert.alert('เวลา', 'ฟังก์ชันเลือกเวลายังไม่เปิดให้ทดสอบในเวอร์ชันนี้');
                }}
              />
            )}
          </SettingsSection>

          <SettingsSection title="ข้อมูล" colors={colors}>
            <SettingsRow icon="🗑️" label="ล้างแคช" colors={colors} onPress={handleClearCache} />
            <SettingsRow
              icon="⭐"
              label="ส่งความคิดเห็น"
              colors={colors}
              onPress={() => setShowFeedback(true)}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: colors.white,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 20 }}>📋</Text>
                <Text style={{ fontSize: 16, color: colors.text, fontFamily: 'Sarabun' }}>
                  เวอร์ชัน
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: colors.textMuted, fontFamily: 'Sarabun' }}>
                {Application.nativeApplicationVersion || '1.0.0'}
              </Text>
            </View>
          </SettingsSection>

          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => ({
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: '#F1A99A',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.brick,
                  fontFamily: 'Sarabun',
                }}
              >
                🚪 ออกจากระบบ
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsSection({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: AppColors;
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 14,
          color: colors.textMuted,
          marginLeft: 16,
          marginBottom: 8,
          fontFamily: 'Sarabun',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      <View
        style={{
          marginHorizontal: 16,
          backgroundColor: colors.white,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  colors,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  colors: AppColors;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: pressed ? colors.surface : colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        <Text style={{ fontSize: 16, color: colors.text, fontFamily: 'Sarabun' }}>{label}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {value && (
          <Text style={{ fontSize: 16, color: colors.textMuted, fontFamily: 'Sarabun' }}>
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={18} color={colors.border2} />
      </View>
    </Pressable>
  );
}
