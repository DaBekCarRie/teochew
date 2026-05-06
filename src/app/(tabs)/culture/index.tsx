import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCultureStore } from '../../../stores/cultureStore';
import { WordOfDayCard } from '../../../components/culture/WordOfDayCard';
import { CultureSectionList } from '../../../components/culture/CultureSectionList';
import * as Notifications from 'expo-notifications';
import { useUserStore } from '../../../stores/userStore';

export default function CultureScreen() {
  const { hydrate, wordOfDay, articles, scheduleDailyNotification } = useCultureStore();
  const { notifEnabled, notifTime } = useUserStore();
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Handle requesting notification permission on first visit
  useEffect(() => {
    async function checkPermissions() {
      if (!permissionRequested && notifEnabled) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status === 'undetermined') {
          // Ask for permission
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus === 'granted') {
            await scheduleDailyNotification(notifTime, true);
          } else {
            useUserStore.getState().setNotifEnabled(false);
          }
        }
        setPermissionRequested(true);
      }
    }
    checkPermissions();
  }, [permissionRequested, notifEnabled, notifTime, scheduleDailyNotification]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#D9C9A8',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2C1A0E', fontFamily: 'Sarabun' }}>
          🏮 วัฒนธรรมแต้จิ๋ว
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {wordOfDay && <WordOfDayCard wordOfDay={wordOfDay} />}

        <CultureSectionList articles={articles} />
      </ScrollView>
    </SafeAreaView>
  );
}
