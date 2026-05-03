import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Lesson, LessonProgress, LessonState } from '../../types/dictionary';

const CARD_SHADOW = {
  shadowColor: '#2C1A0E',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
};

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
    if (isLocked) {
      onLockedPress();
    } else {
      onPress();
    }
  }

  return (
    <Pressable
      className="flex-row items-center"
      style={({ pressed }) => [
        {
          backgroundColor: isLocked ? '#F5F0E8' : isCompleted ? '#FFFDF5' : '#FAF6EE',
          borderWidth: 1.5,
          borderColor: isCompleted ? '#C9A84C' : isInProgress ? '#C8B88A' : '#E0D4B8',
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 18,
          marginBottom: 12,
          opacity: pressed ? 0.82 : 1,
        },
        !isLocked && CARD_SHADOW,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={isLocked ? `${lesson.title} — ล็อก` : `บทเรียน ${lesson.title}`}
    >
      {/* Icon circle */}
      <View
        className="items-center justify-center mr-4 my-3"
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isLocked
            ? '#E8DFC8'
            : isCompleted
              ? '#C9A84C'
              : isInProgress
                ? '#EDE0C4'
                : '#EDE0C4',
          borderWidth: isCompleted ? 0 : 1,
          borderColor: isLocked ? '#D4C4A0' : '#D9C9A8',
        }}
      >
        {isLocked ? (
          <Ionicons name="lock-closed" size={24} color="#B8A070" />
        ) : (
          <Ionicons
            name={lesson.icon as any}
            size={26}
            color={isCompleted ? '#FAF6EE' : '#9A7A2E'}
          />
        )}
      </View>

      {/* Text content */}
      <View className="flex-1">
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: isLocked ? '#C8B88A' : '#2C1A0E',
            marginBottom: 3,
          }}
        >
          {lesson.title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: isLocked ? '#D4C4A0' : '#A08060',
          }}
        >
          {lesson.subtitle ?? `${wordCount} คำ`}
        </Text>

        {/* Progress row */}
        {!isLocked && (
          <View className="flex-row items-center flex-wrap mt-2">
            {progress.flashcardDone && (
              <View className="flex-row items-center rounded-full bg-[#E8F5EE] px-2 py-1 mr-2 mb-1 border border-[#C4DECE]">
                <Ionicons name="albums-outline" size={11} color="#4A7C59" />
                <Text className="ml-1 text-[11px] font-semibold" style={{ color: '#4A7C59' }}>
                  Flashcard ✓
                </Text>
              </View>
            )}
            {score !== null && (
              <View
                className="flex-row items-center rounded-full px-2 py-1 mr-2 mb-1 border"
                style={{
                  backgroundColor: score >= 80 ? '#E8F5EE' : score >= 60 ? '#FEF9E7' : '#FDF0EC',
                  borderColor: score >= 80 ? '#C4DECE' : score >= 60 ? '#E8D88A' : '#EEC4B4',
                }}
              >
                <Ionicons
                  name="trophy-outline"
                  size={11}
                  color={score >= 80 ? '#4A7C59' : score >= 60 ? '#9A7A2E' : '#B5451B'}
                />
                <Text
                  className="ml-1 text-[11px] font-semibold"
                  style={{ color: score >= 80 ? '#4A7C59' : score >= 60 ? '#9A7A2E' : '#B5451B' }}
                >
                  Quiz {score}%
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Locked hint */}
        {isLocked && (
          <Text style={{ fontSize: 11, color: '#C8B88A', marginTop: 4 }}>
            ทำบทเรียนก่อนหน้าให้ผ่านก่อน
          </Text>
        )}
      </View>

      {/* Right indicator */}
      <View className="ml-2">
        {isLocked ? (
          <View className="w-8 h-8 rounded-full bg-[#E8DFC8] items-center justify-center">
            <Ionicons name="lock-closed" size={14} color="#C8B88A" />
          </View>
        ) : isCompleted ? (
          <Ionicons name="checkmark-circle" size={26} color="#C9A84C" />
        ) : (
          <View className="w-8 h-8 rounded-full bg-[#EDE0C4] items-center justify-center">
            <Ionicons name="chevron-forward" size={16} color="#9A7A2E" />
          </View>
        )}
      </View>
    </Pressable>
  );
}
