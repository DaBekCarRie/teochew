import React from 'react';
import { Text, Pressable, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface TranslateButtonProps {
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function TranslateButton({ onPress, disabled, isLoading }: TranslateButtonProps) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }

  const isDisabled = disabled || isLoading;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={({ pressed }) => ({ opacity: isDisabled ? 1 : pressed ? 0.82 : 1 })}
        accessibilityLabel="แปลภาษา"
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        <View style={[styles.btn, isDisabled && styles.btnDisabled]}>
          {isLoading ? (
            <View style={styles.inner}>
              <ActivityIndicator size="small" color="#FAF6EE" />
              <Text style={styles.loadingText}>กำลังแปล...</Text>
            </View>
          ) : (
            <View style={styles.inner}>
              <Text style={[styles.btnText, isDisabled && styles.btnTextDisabled]}>แปลภาษา</Text>
              {!isDisabled && <Ionicons name="arrow-forward" size={16} color="#FAF6EE" />}
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
  },
  btn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B5451B',
    shadowColor: '#B5451B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: '#EDE0C4',
    shadowOpacity: 0,
    elevation: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FAF6EE',
    letterSpacing: 0.4,
    fontFamily: 'Sarabun',
  },
  btnTextDisabled: {
    color: '#B8997A',
  },
  loadingText: {
    fontSize: 15,
    color: '#FAF6EE',
    fontWeight: '600',
    letterSpacing: 0.3,
    fontFamily: 'Sarabun',
  },
});
