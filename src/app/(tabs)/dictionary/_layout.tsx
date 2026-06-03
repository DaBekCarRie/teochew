import { Stack } from 'expo-router';
import { useTheme } from '../../../utils/theme';

export default function DictionaryLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
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
