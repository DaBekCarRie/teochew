import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FAF6EE' },
        headerTintColor: '#2C1A0E',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
