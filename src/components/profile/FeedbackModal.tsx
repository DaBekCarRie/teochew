import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

const RATING_LABELS = ['', 'แย่มาก', 'แย่', 'พอใช้', 'ดี', 'ดีมาก'];
const CATEGORIES = ['แอปโดยรวม', 'พจนานุกรม', 'การเรียนรู้', 'การแปล', 'การถอดเสียง', 'อื่นๆ'];

type GrandparentStatus = 'yes' | 'no' | 'none' | null;

export function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('แอปโดยรวม');
  const [message, setMessage] = useState('');
  const [grandparentStatus, setGrandparentStatus] = useState<GrandparentStatus>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function reset() {
    setRating(0);
    setCategory('แอปโดยรวม');
    setMessage('');
    setGrandparentStatus(null);
    setSubmitted(false);
    setSubmitting(false);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 300);
  }

  async function handleSubmit() {
    if (rating === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);
    try {
      // In prod: POST to Supabase feedback table or API endpoint
      // payload includes: { rating, category, message, grandparent_status: grandparentStatus }
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(handleClose, 2000);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(44,26,14,0.5)', justifyContent: 'flex-end' }}
        onPress={handleClose}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable onPress={() => {}}>
            <View
              style={{
                backgroundColor: '#FAF6EE',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 12,
                paddingBottom: Platform.OS === 'ios' ? 40 : 24,
                maxHeight: '90%',
              }}
            >
              {/* Drag handle */}
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: '#D9C9A8',
                  borderRadius: 2,
                  alignSelf: 'center',
                  marginBottom: 16,
                }}
              />

              <ScrollView
                style={{ paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {submitted ? (
                  <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                    <Ionicons name="checkmark-circle" size={56} color="#4A7C59" />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '700',
                        color: '#2C1A0E',
                        marginTop: 16,
                        textAlign: 'center',
                      }}
                    >
                      ขอบคุณสำหรับความคิดเห็น!
                    </Text>
                    <Text
                      style={{ fontSize: 14, color: '#A08060', marginTop: 8, textAlign: 'center' }}
                    >
                      ความคิดเห็นของคุณช่วยพัฒนาแอปให้ดีขึ้น
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      style={{ fontSize: 20, fontWeight: '700', color: '#2C1A0E', marginBottom: 4 }}
                    >
                      ส่งความคิดเห็น
                    </Text>
                    <Text style={{ fontSize: 13, color: '#A08060', marginBottom: 24 }}>
                      ช่วยเราพัฒนาแอปให้ดีขึ้น
                    </Text>

                    {/* Star rating */}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#6B4C2A',
                        marginBottom: 10,
                      }}
                    >
                      คะแนนโดยรวม <Text style={{ color: '#B5451B' }}>*</Text>
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 12,
                        marginBottom: 6,
                        justifyContent: 'center',
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Pressable
                          key={star}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setRating(star);
                          }}
                        >
                          <Ionicons
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={36}
                            color={star <= rating ? '#C9A84C' : '#D9C9A8'}
                          />
                        </Pressable>
                      ))}
                    </View>
                    {rating > 0 && (
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#9A7A2E',
                          textAlign: 'center',
                          marginBottom: 20,
                        }}
                      >
                        {RATING_LABELS[rating]}
                      </Text>
                    )}
                    {rating === 0 && <View style={{ marginBottom: 20 }} />}

                    {/* Category */}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#6B4C2A',
                        marginBottom: 10,
                      }}
                    >
                      หมวดหมู่
                    </Text>
                    <View
                      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}
                    >
                      {CATEGORIES.map((cat) => (
                        <Pressable
                          key={cat}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setCategory(cat);
                          }}
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 7,
                            borderRadius: 999,
                            backgroundColor: category === cat ? '#B5451B' : '#EDE0C4',
                            borderWidth: 1,
                            borderColor: category === cat ? '#B5451B' : '#D9C9A8',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              color: category === cat ? '#FAF6EE' : '#6B4C2A',
                              fontWeight: '500',
                            }}
                          >
                            {cat}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    {/* Grandparent status */}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#6B4C2A',
                        marginBottom: 10,
                      }}
                    >
                      คุณมีปู่ย่าตายายที่พูดภาษาแต้จิ๋วอยู่ไหม?
                    </Text>
                    {(
                      [
                        { value: 'yes', label: 'ใช่' },
                        { value: 'no', label: 'ไม่แล้ว' },
                        { value: 'none', label: 'ไม่มีปู่ย่าที่พูดแต้จิ๋ว' },
                      ] as { value: GrandparentStatus; label: string }[]
                    ).map(({ value, label }) => (
                      <Pressable
                        key={value}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setGrandparentStatus(value);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                          paddingVertical: 8,
                        }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: grandparentStatus === value ? '#B5451B' : '#D9C9A8',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {grandparentStatus === value && (
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#B5451B',
                              }}
                            />
                          )}
                        </View>
                        <Text style={{ fontSize: 14, color: '#2C1A0E' }}>{label}</Text>
                      </Pressable>
                    ))}
                    <View style={{ marginBottom: 20 }} />

                    {/* Message */}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: '#6B4C2A',
                        marginBottom: 10,
                      }}
                    >
                      ข้อความ (ไม่บังคับ)
                    </Text>
                    <TextInput
                      value={message}
                      onChangeText={setMessage}
                      placeholder="บอกเราว่าคุณคิดอะไร..."
                      placeholderTextColor="#C9B896"
                      multiline
                      numberOfLines={4}
                      maxLength={500}
                      style={{
                        backgroundColor: '#F5EDD8',
                        borderWidth: 1,
                        borderColor: '#D9C9A8',
                        borderRadius: 12,
                        padding: 14,
                        fontSize: 15,
                        color: '#2C1A0E',
                        minHeight: 100,
                        textAlignVertical: 'top',
                        marginBottom: 6,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        color: '#A08060',
                        textAlign: 'right',
                        marginBottom: 24,
                      }}
                    >
                      {message.length}/500
                    </Text>

                    {/* Submit */}
                    <Pressable
                      onPress={handleSubmit}
                      disabled={rating === 0 || submitting}
                      style={({ pressed }) => ({
                        height: 52,
                        borderRadius: 14,
                        backgroundColor: rating === 0 ? '#D9C9A8' : pressed ? '#7A2E0F' : '#B5451B',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                        flexDirection: 'row',
                        gap: 8,
                      })}
                    >
                      {submitting ? (
                        <ActivityIndicator color="#FAF6EE" />
                      ) : (
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: rating === 0 ? '#A08060' : '#FAF6EE',
                          }}
                        >
                          ส่งความคิดเห็น
                        </Text>
                      )}
                    </Pressable>
                  </>
                )}
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
