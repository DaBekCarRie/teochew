import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCultureStore } from '../../../stores/cultureStore';
import { WordOfDayCard } from '../../../components/culture/WordOfDayCard';
import { PhraseOfDayCard } from '../../../components/culture/PhraseOfDayCard';
import { FestivalCountdownBanner } from '../../../components/culture/FestivalCountdownBanner';
import { DiasporaOriginCard } from '../../../components/culture/DiasporaOriginCard';
import { CultureSectionList } from '../../../components/culture/CultureSectionList';
import { getNextFestival } from '../../../data/mockFestivals';
import * as Notifications from 'expo-notifications';
import { useUserStore } from '../../../stores/userStore';

type FilterKey = 'all' | 'festival' | 'food' | 'wedding' | 'religion';

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'festival', label: 'เทศกาล' },
  { key: 'food', label: 'อาหาร' },
  { key: 'wedding', label: 'พิธีมงคล' },
  { key: 'religion', label: 'ความเชื่อ' },
];

export default function CultureScreen() {
  const router = useRouter();
  const { hydrate, wordOfDay, phraseOfDay, articles, scheduleDailyNotification } =
    useCultureStore();
  const { notifEnabled, notifTime } = useUserStore();
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const nextFestival = getNextFestival(new Date());

  const today = new Date();
  const todayLabel = today.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    async function checkPermissions() {
      if (!permissionRequested && notifEnabled) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status === 'undetermined') {
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
    <SafeAreaView className="flex-1 bg-cream-50">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text className="text-[22px] font-extrabold text-brown-900 font-sarabun leading-[26px]">
              วัฒนธรรมแต้จิ๋ว
            </Text>
            <Text className="text-[13px] text-brown-400 font-sarabun tracking-[0.5px]">
              Teochew Culture
            </Text>
          </View>
          <Pressable className="w-[38px] h-[38px] rounded-full bg-cream-100 items-center justify-center active:opacity-60">
            <Ionicons name="search" size={20} color="#2C1A0E" />
          </Pressable>
        </View>
        <View style={styles.headerRule} />
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Festival countdown */}
        {nextFestival && <FestivalCountdownBanner festival={nextFestival} />}

        {/* Daily discoveries section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ค้นพบวันนี้</Text>
          <Text style={styles.sectionDate}>{todayLabel}</Text>
        </View>

        {wordOfDay && <WordOfDayCard wordOfDay={wordOfDay} />}
        {phraseOfDay && <PhraseOfDayCard phrase={phraseOfDay} />}

        {/* Folktales entry */}
        <View className="mx-5 mt-4 bg-white rounded-[18px] border border-cream-200 overflow-hidden shadow-sm elevation-2">
          <Pressable
            onPress={() => router.push('/culture/folktales')}
            className="flex-row items-center p-4 active:bg-cream-50"
          >
            <View className="w-12 h-12 rounded-xl bg-gold-50 items-center justify-center mr-4 border border-gold-100">
              <Ionicons name="book" size={24} color="#C9A84C" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-brown-900 font-sarabun">
                นิทานและสุภาษิตแต้จิ๋ว
              </Text>
              <Text className="text-xs text-brown-400 font-sarabun mt-1">
                ฟังเสียงเล่าเรื่อง พร้อมคำอ่านและคำแปล
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D9C9A8" />
          </Pressable>
        </View>

        {/* Diaspora origin */}
        <DiasporaOriginCard />

        {/* Article sections */}
        <CultureSectionList articles={articles} filter={activeFilter} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    // Replaced by className="flex-1 bg-cream-50"
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    lineHeight: 26,
  },
  headerSub: {
    fontSize: 13,
    color: '#A08060',
    fontFamily: 'Sarabun',
    letterSpacing: 0.5,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0E6D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRule: {
    height: 1,
    backgroundColor: '#EDE0C4',
  },
  filterScroll: {
    flexGrow: 0,
    marginTop: 12,
    marginBottom: 4,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F0E6D0',
    borderWidth: 1,
    borderColor: '#EDE0C4',
  },
  filterTabActive: {
    backgroundColor: '#2C1A0E',
    borderColor: '#2C1A0E',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B4C2A',
    fontFamily: 'Sarabun',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
    letterSpacing: 0.3,
  },
  sectionDate: {
    fontSize: 13,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
});
