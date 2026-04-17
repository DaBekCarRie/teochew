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

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp() {
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    const { error: authError } = await signUp(email.trim(), password);
    setIsSubmitting(false);
    if (authError) {
      setError(authError);
    } else {
      setSuccessMsg('สมัครสมาชิกสำเร็จ! กรุณายืนยันอีเมลของคุณ');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <KeyboardAvoidingView
        className="flex-1 px-6 justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text className="text-3xl font-bold text-brown-900 mb-1">สมัครสมาชิก</Text>
        <Text className="text-sm text-brown-400 mb-8">สร้างบัญชีใหม่</Text>

        {error && (
          <View className="bg-brick-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-sm text-brick-800">{error}</Text>
          </View>
        )}

        {successMsg && (
          <View className="bg-gold-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-sm text-gold-700">{successMsg}</Text>
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
            placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
            placeholderTextColor="#A08060"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
        </View>

        <Pressable
          className="bg-gold-500 rounded-xl py-3.5 mt-6 items-center"
          onPress={handleSignUp}
          disabled={isSubmitting}
          style={({ pressed }) => ({ opacity: pressed || isSubmitting ? 0.7 : 1 })}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FAF6EE" />
          ) : (
            <Text className="text-base font-semibold text-cream-50">สมัครสมาชิก</Text>
          )}
        </Pressable>

        <Pressable className="mt-4 items-center py-2" onPress={() => router.back()}>
          <Text className="text-sm text-brown-400">
            มีบัญชีแล้ว? <Text className="text-gold-700 font-medium">เข้าสู่ระบบ</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
