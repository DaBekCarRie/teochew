import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useProgressStore } from '../../../stores/progressStore';
import { useStreakStore } from '../../../stores/streakStore';
import { LESSONS } from '../../../services/lessons';
import { useLessonStore } from '../../../stores/lessonStore';
import { MOCK_WORDS } from '../../../services/supabase/mockWords';

import { OverviewCards } from '../../../components/progress/OverviewCards';
import { MasteryBreakdown } from '../../../components/progress/MasteryBreakdown';
import { WeakWordsList } from '../../../components/progress/WeakWordsList';
import { SyncStatusBar } from '../../../components/progress/SyncStatusBar';
import { StreakCounter } from '../../../components/streak/StreakCounter';
import { StreakBreakWarning } from '../../../components/streak/StreakBreakWarning';
import { StreakFreezeConfirmation } from '../../../components/streak/StreakFreezeConfirmation';
import { MilestoneCelebration } from '../../../components/streak/MilestoneCelebration';
import { ReminderSettings } from '../../../components/streak/ReminderSettings';

export default function ProgressScreen() {
  const router = useRouter();

  // Warning modal: dismissed once per app session
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [showFreezeConfirmation, setShowFreezeConfirmation] = useState(false);

  // Progress store
  const {
    hydrate: hydrateProgress,
    hydrated: progressHydrated,
    getTotalWordsLearned,
    getTotalWordsMastered,
    getTotalStudyTimeMs,
    getMasteryBreakdown,
    getWeakWords,
    syncStatus,
    lastSyncAt,
    pendingSessionIds,
  } = useProgressStore();

  // Streak store
  const {
    hydrate: hydrateStreak,
    streak,
    reminderSettings,
    pendingMilestone,
    clearMilestone,
    useFreeze: activateFreeze,
    updateReminderSettings,
    getHasStudiedToday,
  } = useStreakStore();

  const { hydrate: hydrateLessons, getProgress } = useLessonStore();

  useEffect(() => {
    hydrateProgress();
    hydrateStreak();
    hydrateLessons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const lessonIds = LESSONS.map((l) => l.id);
  const lessonsCompleted = lessonIds.filter((id) => {
    const p = getProgress(id);
    return (p.quizBestScore ?? -1) >= 60;
  }).length;

  const totalWordsLearned = progressHydrated ? getTotalWordsLearned() : 0;
  const totalWordsMastered = progressHydrated ? getTotalWordsMastered() : 0;
  const totalStudyTimeMs = progressHydrated ? getTotalStudyTimeMs() : 0;
  const breakdown = progressHydrated
    ? getMasteryBreakdown()
    : { new: 0, learning: 0, reviewing: 0, mastered: 0 };
  const weakWords = progressHydrated ? getWeakWords(10) : [];
  const isEmpty = totalWordsLearned === 0 && totalWordsMastered === 0 && totalStudyTimeMs === 0;

  const hasStudiedToday = getHasStudiedToday();
  const currentHour = new Date().getHours();
  const showWarning =
    streak.currentStreak > 0 && !hasStudiedToday && currentHour >= 20 && !warningDismissed;

  function handleReviewWeakWords() {
    const ids = weakWords.map((w) => w.wordId).join(',');
    router.push({
      pathname: '/learn/flashcard',
      params: {
        deckTitle: 'คำที่ต้องทบทวน',
        wordIds: ids,
      },
    });
  }

  function handleStudyNow() {
    setWarningDismissed(true);
    router.push('/learn');
  }

  function handleUseFreeze() {
    const result = activateFreeze();
    if (result === 'ok') {
      setWarningDismissed(true);
      setShowFreezeConfirmation(true);
    }
    // 'no_freezes' and 'limit_reached' are handled inside the modal (button disabled)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#D9C9A8',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#2C1A0E' }}>ความก้าวหน้า</Text>
          <Text style={{ fontSize: 13, color: '#A08060', marginTop: 2 }}>
            สถิติการเรียนรู้ของคุณ
          </Text>
        </View>

        {/* Sync status icon */}
        <Pressable
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityLabel="สถานะการซิงค์"
          accessibilityRole="button"
        >
          <Ionicons
            name={
              syncStatus === 'syncing'
                ? 'sync-outline'
                : syncStatus === 'error'
                  ? 'cloud-offline-outline'
                  : syncStatus === 'pending'
                    ? 'cloud-upload-outline'
                    : 'checkmark-circle-outline'
            }
            size={22}
            color={
              syncStatus === 'syncing'
                ? '#C9A84C'
                : syncStatus === 'error'
                  ? '#B5451B'
                  : syncStatus === 'pending'
                    ? '#A08060'
                    : '#4A7C59'
            }
          />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak counter */}
        <StreakCounter
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          hasStudiedToday={hasStudiedToday}
          freezeCount={streak.freezeCount}
        />

        <OverviewCards
          totalWordsLearned={totalWordsLearned}
          totalWordsMastered={totalWordsMastered}
          totalStudyTimeMs={totalStudyTimeMs}
          lessonsCompleted={lessonsCompleted}
          totalLessons={LESSONS.length}
          isEmpty={isEmpty}
        />

        <MasteryBreakdown breakdown={breakdown} />

        <WeakWordsList
          weakWords={weakWords}
          allWords={MOCK_WORDS}
          onReviewPress={handleReviewWeakWords}
        />

        <SyncStatusBar
          status={syncStatus}
          lastSyncAt={lastSyncAt}
          pendingCount={pendingSessionIds.length}
        />

        {/* Reminder settings */}
        <ReminderSettings settings={reminderSettings} onUpdate={updateReminderSettings} />
      </ScrollView>

      {/* Modals */}
      <StreakBreakWarning
        visible={showWarning}
        currentStreak={streak.currentStreak}
        freezeCount={streak.freezeCount}
        onStudyNow={handleStudyNow}
        onUseFreeze={handleUseFreeze}
        onDismiss={() => setWarningDismissed(true)}
      />

      <StreakFreezeConfirmation
        visible={showFreezeConfirmation}
        remainingFreezes={streak.freezeCount}
        onClose={() => setShowFreezeConfirmation(false)}
      />

      <MilestoneCelebration
        visible={pendingMilestone !== null}
        milestone={pendingMilestone ?? 7}
        onClose={clearMilestone}
      />
    </SafeAreaView>
  );
}
