import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useXPStore } from '../../../stores/xpStore';
import { BADGE_DEFS, TOTAL_BADGES } from '../../../constants/badges';
import { BadgeCell } from '../../../components/xp/BadgeCell';
import type { BadgeDef, EarnedBadge } from '../../../types/dictionary';

function BadgeDetailModal({
  badge,
  earnedData,
  onClose,
}: {
  badge: BadgeDef | null;
  earnedData?: EarnedBadge;
  onClose: () => void;
}) {
  if (!badge) return null;

  const isEarned = !!earnedData;
  const dateStr = isEarned
    ? new Date(earnedData.earned_at).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      })
    : '';

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(44,26,14,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: '#FAF6EE', // cream-50
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
            width: '85%',
            maxWidth: 320,
          }}
          // prevent bubbling to backdrop
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ opacity: isEarned ? 1 : 0.3 }}>
            <Text style={{ fontSize: 64, marginBottom: 12 }}>{badge.icon}</Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C1A0E', textAlign: 'center' }}>
            "{badge.name_th}"
          </Text>

          <Text style={{ fontSize: 14, color: '#7A5C38', marginTop: 8, textAlign: 'center' }}>
            {badge.description_th}
          </Text>

          <View
            style={{ height: 1, backgroundColor: '#D9C9A8', width: '100%', marginVertical: 16 }}
          />

          {isEarned ? (
            <>
              <Text style={{ fontSize: 12, color: '#A08060', textAlign: 'center' }}>
                ได้รับเมื่อ: {dateStr}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#C9A84C',
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                +{badge.xp_reward} XP
              </Text>
            </>
          ) : (
            <Text
              style={{ fontSize: 14, color: '#A08060', textAlign: 'center', fontStyle: 'italic' }}
            >
              เงื่อนไขปลดล็อก: {badge.condition_display}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => ({
              backgroundColor: '#B5451B',
              borderRadius: 10,
              paddingVertical: 12,
              width: '100%',
              alignItems: 'center',
              marginTop: 20,
              opacity: pressed ? 0.8 : 1,
            })}
            onPress={onClose}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FAF6EE' }}>ปิด</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function BadgeCollectionScreen() {
  const router = useRouter();
  const { earnedBadges, getEarnedBadgeKeys } = useXPStore();
  const earnedKeys = getEarnedBadgeKeys();

  const [selectedBadge, setSelectedBadge] = useState<BadgeDef | null>(null);

  const categories = [
    { id: 'learning', title: 'การเรียน' },
    { id: 'quiz', title: 'Quiz' },
    { id: 'streak', title: 'Streak' },
    { id: 'mastery', title: 'ความเชี่ยวชาญ' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF6EE' }} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `เหรียญรางวัล  ${earnedBadges.length}/${TOTAL_BADGES}`,
          headerStyle: { backgroundColor: '#FAF6EE' },
          headerTintColor: '#2C1A0E',
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 8, padding: 8 }}>
              <Ionicons name="arrow-back" size={24} color="#2C1A0E" />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat) => {
          const catBadges = BADGE_DEFS.filter((b) => b.category === cat.id);
          if (catBadges.length === 0) return null;

          return (
            <View key={cat.id} style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#2C1A0E', marginBottom: 12 }}>
                {cat.title}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {catBadges.map((badge) => (
                  <BadgeCell
                    key={badge.condition_key}
                    badge={badge}
                    earnedData={earnedBadges.find((b) => b.condition_key === badge.condition_key)}
                    onPress={() => setSelectedBadge(badge)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <BadgeDetailModal
        badge={selectedBadge}
        earnedData={
          selectedBadge
            ? earnedBadges.find((b) => b.condition_key === selectedBadge.condition_key)
            : undefined
        }
        onClose={() => setSelectedBadge(null)}
      />
    </SafeAreaView>
  );
}
