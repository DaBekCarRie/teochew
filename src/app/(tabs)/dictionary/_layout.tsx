import { Stack } from 'expo-router';

export default function DictionaryLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FAF6EE' },
        headerTintColor: '#2C1A0E',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        headerBackTitle: 'กลับ',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="saved" options={{ title: 'คำที่บันทึกไว้' }} />
      <Stack.Screen name="[wordId]" options={{ title: '' }} />
    </Stack>
  );
}
