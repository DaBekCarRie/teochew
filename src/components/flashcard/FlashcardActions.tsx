import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface FlashcardActionsProps {
  onUnknown: () => void;
  onKnown: () => void;
  disabled: boolean;
}

export function FlashcardActions({ onUnknown, onKnown, disabled }: FlashcardActionsProps) {
  return (
    <View style={styles.row}>
      {/* Unknown — wrapper carries flex:1 to avoid New Architecture Pressable bug */}
      <View style={styles.btnWrap}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onUnknown();
          }}
          disabled={disabled}
          style={({ pressed }) => ({ opacity: disabled ? 0.4 : pressed ? 0.75 : 1 })}
          accessibilityLabel="ต้องทบทวน"
          accessibilityRole="button"
        >
          <View style={styles.btnUnknown}>
            <Ionicons name="refresh-outline" size={18} color="#B5451B" />
            <Text style={styles.btnUnknownText}>ต้องทบทวน</Text>
          </View>
        </Pressable>
      </View>

      {/* Known */}
      <View style={styles.btnWrap}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onKnown();
          }}
          disabled={disabled}
          style={({ pressed }) => ({ opacity: disabled ? 0.4 : pressed ? 0.75 : 1 })}
          accessibilityLabel="จำได้แล้ว"
          accessibilityRole="button"
        >
          <View style={styles.btnKnown}>
            <Ionicons name="checkmark" size={18} color="#FAF6EE" />
            <Text style={styles.btnKnownText}>จำได้แล้ว</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  btnWrap: {
    flex: 1,
  },
  btnUnknown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EEC4B4',
    backgroundColor: '#FDF0EC',
    minHeight: 52,
  },
  btnUnknownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B5451B',
    fontFamily: 'Sarabun',
  },
  btnKnown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#4A7C59',
    minHeight: 52,
  },
  btnKnownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FAF6EE',
    fontFamily: 'Sarabun',
  },
});
