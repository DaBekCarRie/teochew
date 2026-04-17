import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    setError(null);
    setIsSubmitting(true);
    const { error: authError } = await signIn(email.trim(), password);
    setIsSubmitting(false);
    if (authError) {
      setError(authError);
    }
    // Navigation handled by root _layout.tsx session guard
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <KeyboardAvoidingView
        className="flex-1 px-6 justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text className="text-3xl font-bold text-brown-900 mb-1">เข้าสู่ระบบ</Text>
        <Text className="text-sm text-brown-400 mb-8">แอปพจนานุกรมแต้จิ๋ว</Text>

        {error && (
          <View className="bg-brick-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-sm text-brick-800">{error}</Text>
          </View>
        )}

        <View className="gap-3">
          <TextInput
            className="bg-white border border-cream-300 rounded-xl px-4 py-3 text-base text-brown-900"
            placeholder="อีเมล"
            placeholderTextColor="#A08060"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            className="bg-white border border-cream-300 rounded-xl px-4 py-3 text-base text-brown-900"
            placeholder="รหัสผ่าน"
            placeholderTextColor="#A08060"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <Pressable
          className="bg-gold-500 rounded-xl py-3.5 mt-6 items-center"
          onPress={handleSignIn}
          disabled={isSubmitting}
          style={({ pressed }) => ({ opacity: pressed || isSubmitting ? 0.7 : 1 })}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FAF6EE" />
          ) : (
            <Text className="text-base font-semibold text-cream-50">เข้าสู่ระบบ</Text>
          )}
        </Pressable>

        <Pressable
          className="mt-4 items-center py-2"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="text-sm text-brown-400">
            ยังไม่มีบัญชี? <Text className="text-gold-700 font-medium">สมัครสมาชิก</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
