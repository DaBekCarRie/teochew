import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TONES } from '../../utils/toneData';
import { isShortTone } from '../../utils/pitchContourPath';

interface ToneTooltipProps {
  toneNumber: number;
  visible: boolean;
  onClose: () => void;
  /** If provided, shows "▶ ฟังตัวอย่าง" button */
  onPlayAudio?: () => void;
}

export function ToneTooltip({ toneNumber, visible, onClose, onPlayAudio }: ToneTooltipProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tone = TONES.find((t) => t.number === toneNumber);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 18,
          stiffness: 250,
          useNativeDriver: true,
        }),
      ]).start();
      dismissTimer.current = setTimeout(onClose, 5000);
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 130, useNativeDriver: true }).start();
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
        dismissTimer.current = null;
      }
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [visible, fadeAnim, scaleAnim, onClose]);

  if (!tone) return null;

  const short = isShortTone(tone.pitch_contour);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(44,26,14,0.3)',
        }}
        onPress={onClose}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: '#2C1A0E',
            borderRadius: 14,
            padding: 16,
            maxWidth: 284,
            width: '82%',
          }}
          accessibilityLiveRegion="polite"
        >
          {/* Header: color dot + title + close */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <View
                style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tone.color }}
              />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FAF6EE', flex: 1 }}>
                เสียงที่ {tone.number}: {tone.name_th}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={16} color="#A08060" />
            </Pressable>
          </View>

          {/* Chinese name */}
          <Text style={{ fontSize: 13, color: '#A08060', marginBottom: 4 }}>{tone.name_zh}</Text>

          {/* Pitch contour + description */}
          <Text style={{ fontSize: 13, color: '#D9C9A8', marginBottom: 6 }}>
            {tone.pitch_contour}
            {short ? ' · เสียงสั้น (-p/-t/-k)' : ''} — {tone.description_th}
          </Text>

          {/* Example */}
          <Text style={{ fontSize: 13, color: '#C9A84C', marginBottom: onPlayAudio ? 10 : 0 }}>
            {tone.example_char} {tone.example_pengim} = {tone.example_meaning_th}
          </Text>

          {/* Audio play link */}
          {onPlayAudio && (
            <Pressable
              onPress={() => {
                onPlayAudio();
                onClose();
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: '#3D2A1A',
                opacity: pressed ? 0.7 : 1,
              })}
              accessibilityRole="button"
              accessibilityLabel={`ฟังตัวอย่างเสียงที่ ${tone.number}`}
            >
              <Ionicons name="play-circle-outline" size={16} color="#C9A84C" />
              <Text style={{ fontSize: 13, color: '#C9A84C', fontWeight: '600' }}>ฟังตัวอย่าง</Text>
            </Pressable>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
