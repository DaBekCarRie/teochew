import { Stack } from 'expo-router';

export default function LearnLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="lesson/[lessonId]" />
      <Stack.Screen name="flashcard" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="quiz-summary" />
    </Stack>
  );
}
