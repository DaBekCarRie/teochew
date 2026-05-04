import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TranslationResult } from '../../types/translation';
import { UnverifiedBadge } from './UnverifiedBadge';

interface CrowdsourceBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  wordResult: TranslationResult;
}

export function CrowdsourceBottomSheet({
  isVisible,
  onClose,
  wordResult,
}: CrowdsourceBottomSheetProps) {
  const [teochewChar, setTeochewChar] = useState('');
  const [pengim, setPengim] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

  const isValid = teochewChar.trim().length > 0 && pengim.trim().length > 0;

  function handleClose() {
    setTeochewChar('');
    setPengim('');
    setNote('');
    setSubmitState('idle');
    onClose();
  }

  async function handleSubmit() {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitState('success');
      setTimeout(handleClose, 3000);
    } catch {
      setSubmitState('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(44,26,14,0.4)' }}
          onPress={handleClose}
        />
        <View
          style={{
            backgroundColor: '#FAF6EE',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '85%',
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 4 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#D9C9A8' }} />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="create-outline" size={18} color="#2C1A0E" />
              <Text style={{ fontSize: 17, fontWeight: '600', color: '#2C1A0E' }}>
                ส่งคำที่ถูกต้อง
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.6 : 1,
              })}
              accessibilityLabel="ปิด"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={20} color="#A08060" />
            </Pressable>
          </View>

          <ScrollView
            style={{ paddingHorizontal: 20 }}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {submitState === 'success' ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 64 }}>🎉</Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#2C1A0E',
                    textAlign: 'center',
                    marginTop: 16,
                  }}
                  accessibilityLiveRegion="polite"
                >
                  ขอบคุณ! คำของคุณจะถูกตรวจสอบโดยทีมงานของเรา
                </Text>
                <Pressable
                  onPress={handleClose}
                  style={({ pressed }) => ({
                    marginTop: 20,
                    borderWidth: 1,
                    borderColor: '#D9C9A8',
                    borderRadius: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontSize: 14, color: '#6B4C2A' }}>ปิด</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* Context card */}
                <View
                  style={{
                    backgroundColor: '#F5EDD8',
                    borderWidth: 1,
                    borderColor: '#D9C9A8',
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 20,
                  }}
                >
                  <UnverifiedBadge />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1A0E' }}>
                    {wordResult.teochew_char ?? '—'}{' '}
                    <Text style={{ fontStyle: 'italic', color: '#9A7A2E', fontWeight: '400' }}>
                      ({wordResult.pengim ?? '—'})
                    </Text>
                  </Text>
                  {wordResult.thai_meaning && (
                    <Text style={{ fontSize: 13, color: '#6B4C2A', marginTop: 4 }}>
                      ความหมาย: {wordResult.thai_meaning}
                    </Text>
                  )}
                </View>

                {/* Field: Teochew char */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{ fontSize: 13, fontWeight: '500', color: '#2C1A0E', marginBottom: 6 }}
                  >
                    คำแต้จิ๋ว (อักษรจีน) *
                  </Text>
                  <TextInput
                    value={teochewChar}
                    onChangeText={setTeochewChar}
                    placeholder="กรอกอักษรแต้จิ๋ว เช่น 汝好"
                    placeholderTextColor="#A08060"
                    maxLength={50}
                    style={{
                      backgroundColor: '#F5EDD8',
                      borderWidth: 1,
                      borderColor: '#D9C9A8',
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      fontSize: 16,
                      color: '#2C1A0E',
                    }}
                    accessibilityLabel="คำแต้จิ๋ว required"
                  />
                </View>

                {/* Field: Pengim */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{ fontSize: 13, fontWeight: '500', color: '#2C1A0E', marginBottom: 6 }}
                  >
                    Peng'im (การออกเสียง) *
                  </Text>
                  <TextInput
                    value={pengim}
                    onChangeText={setPengim}
                    placeholder="เช่น le2 ho2"
                    placeholderTextColor="#A08060"
                    maxLength={100}
                    style={{
                      backgroundColor: '#F5EDD8',
                      borderWidth: 1,
                      borderColor: '#D9C9A8',
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      fontSize: 15,
                      color: '#2C1A0E',
                    }}
                    accessibilityLabel="Peng'im required"
                  />
                  <Text style={{ fontSize: 11, color: '#A08060', marginTop: 4 }}>
                    ใช้ตัวเลขเป็น tone marks เช่น a1 a2 a3 a4 a5 a6 a7 a8
                  </Text>
                </View>

                {/* Field: Note */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{ fontSize: 13, fontWeight: '500', color: '#2C1A0E', marginBottom: 6 }}
                  >
                    หมายเหตุ / เหตุผล (ไม่บังคับ)
                  </Text>
                  <TextInput
                    value={note}
                    onChangeText={setNote}
                    placeholder="อธิบายเพิ่มเติม เช่น ภาษาถิ่น Swatow..."
                    placeholderTextColor="#A08060"
                    maxLength={200}
                    multiline
                    style={{
                      backgroundColor: '#F5EDD8',
                      borderWidth: 1,
                      borderColor: '#D9C9A8',
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      fontSize: 14,
                      color: '#2C1A0E',
                      minHeight: 72,
                      textAlignVertical: 'top',
                    }}
                    accessibilityLabel="หมายเหตุ optional"
                  />
                  <Text
                    style={{ fontSize: 11, color: '#A08060', textAlign: 'right', marginTop: 4 }}
                  >
                    {note.length}/200
                  </Text>
                </View>

                {submitState === 'error' && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#B5451B',
                      marginBottom: 12,
                      textAlign: 'center',
                    }}
                  >
                    เกิดข้อผิดพลาด กรุณาลองใหม่
                  </Text>
                )}

                {/* Submit button */}
                <Pressable
                  onPress={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  style={({ pressed }) => ({
                    height: 52,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isValid && !isSubmitting ? '#B5451B' : '#EDE0C4',
                    opacity: pressed ? 0.85 : 1,
                  })}
                  accessibilityLabel="ส่งคำที่ถูกต้อง"
                  accessibilityState={{ disabled: !isValid || isSubmitting }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FAF6EE" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: isValid ? '#FAF6EE' : '#A08060',
                      }}
                    >
                      ส่งคำที่ถูกต้อง
                    </Text>
                  )}
                </Pressable>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
