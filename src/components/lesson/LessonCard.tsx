import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Lesson, LessonProgress, LessonState } from '../../types/dictionary';

interface LessonCardProps {
  lesson: Lesson;
  state: LessonState;
  progress: LessonProgress;
  onPress: () => void;
  onLockedPress: () => void;
}

export function LessonCard({ lesson, state, progress, onPress, onLockedPress }: LessonCardProps) {
  const isLocked = state === 'locked';
  const isCompleted = state === 'completed';
  const isInProgress = state === 'in_progress';

  const score = progress.quizBestScore;
  const wordCount = lesson.word_ids.length;

  function handlePress() {
    if (isLocked) onLockedPress();
    else onPress();
  }

  const accentColor = isCompleted
    ? '#C9A84C'
    : isInProgress
      ? '#C9A84C'
      : isLocked
        ? '#E0D4B8'
        : '#C9A84C';
  const iconBg = isCompleted ? '#C9A84C' : isLocked ? '#E8DFC8' : '#EDE0C4';
  const iconColor = isCompleted ? '#FFFFFF' : isLocked ? '#B8A070' : '#9A7A2E';
  const cardBg = isCompleted ? '#FFFDF5' : isLocked ? '#F5F0E8' : '#FFFFFF';
  const borderColor = isCompleted
    ? '#C9A84C'
    : isInProgress
      ? '#D9C9A8'
      : isLocked
        ? '#E8DFC8'
        : '#EDE0C4';

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}
      accessibilityRole="button"
      accessibilityLabel={isLocked ? `${lesson.title} — ล็อก` : `บทเรียน ${lesson.title}`}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor,
          },
          !isLocked && styles.shadow,
        ]}
      >
        {/* Left accent strip */}
        <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />

        {/* Icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          {isLocked ? (
            <Ionicons name="lock-closed" size={22} color="#B8A070" />
          ) : (
            <Ionicons name={lesson.icon as any} size={24} color={iconColor} />
          )}
        </View>

        {/* Text content */}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: isLocked ? '#C8B88A' : '#2C1A0E' }]}>
            {lesson.title}
          </Text>
          <Text style={[styles.subtitle, { color: isLocked ? '#D4C4A0' : '#A08060' }]}>
            {lesson.subtitle ?? `${wordCount} คำ`}
          </Text>

          {/* Progress badges */}
          {!isLocked && (
            <View style={styles.badgeRow}>
              {progress.flashcardDone && (
                <View style={[styles.badge, styles.badgeGreen]}>
                  <Ionicons name="albums-outline" size={11} color="#4A7C59" />
                  <Text style={[styles.badgeText, { color: '#4A7C59' }]}>Flashcard ✓</Text>
                </View>
              )}
              {score !== null && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        score >= 80 ? '#E8F5EE' : score >= 60 ? '#FEF9E7' : '#FDF0EC',
                      borderColor: score >= 80 ? '#C4DECE' : score >= 60 ? '#E8D88A' : '#EEC4B4',
                    },
                  ]}
                >
                  <Ionicons
                    name="trophy-outline"
                    size={11}
                    color={score >= 80 ? '#4A7C59' : score >= 60 ? '#9A7A2E' : '#B5451B'}
                  />
                  <Text
                    style={[
                      styles.badgeText,
                      { color: score >= 80 ? '#4A7C59' : score >= 60 ? '#9A7A2E' : '#B5451B' },
                    ]}
                  >
                    Quiz {score}%
                  </Text>
                </View>
              )}
            </View>
          )}

          {isLocked && <Text style={styles.lockedHint}>ทำบทเรียนก่อนหน้าให้ผ่านก่อน</Text>}
        </View>

        {/* Right indicator */}
        <View style={styles.rightIndicator}>
          {isLocked ? (
            <View style={[styles.indicatorCircle, { backgroundColor: '#E8DFC8' }]}>
              <Ionicons name="lock-closed" size={13} color="#C8B88A" />
            </View>
          ) : isCompleted ? (
            <Ionicons name="checkmark-circle" size={28} color="#C9A84C" />
          ) : (
            <View style={[styles.indicatorCircle, { backgroundColor: '#EDE0C4' }]}>
              <Ionicons name="chevron-forward" size={15} color="#9A7A2E" />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    paddingRight: 16,
    paddingVertical: 16,
    gap: 0,
  },
  shadow: {
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  accentStrip: {
    width: 4,
    alignSelf: 'stretch',
    flexShrink: 0,
    marginRight: 14,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 14,
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Sarabun',
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Sarabun',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgeGreen: {
    backgroundColor: '#E8F5EE',
    borderColor: '#C4DECE',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Sarabun',
  },
  lockedHint: {
    fontSize: 11,
    color: '#C8B88A',
    fontFamily: 'Sarabun',
    marginTop: 2,
  },
  rightIndicator: {
    marginLeft: 8,
    flexShrink: 0,
  },
  indicatorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
