import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TranslationHeaderProps {
  onHistoryPress: () => void;
}

export function TranslationHeader({ onHistoryPress }: TranslationHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>潮州語</Text>
        <Text style={styles.title}>แปลภาษา</Text>
      </View>

      {/* Wrapper pattern — fixes New Architecture Pressable layout bug */}
      <View style={styles.historyWrap}>
        <Pressable
          onPress={onHistoryPress}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          accessibilityLabel="ประวัติการแปล"
          accessibilityRole="button"
        >
          <View style={styles.historyBtn}>
            <Ionicons name="time-outline" size={14} color="#9A7A2E" />
            <Text style={styles.historyText}>ประวัติ</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#FAF6EE',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE0C4',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C9A84C',
    letterSpacing: 3.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C1A0E',
    letterSpacing: -0.3,
    fontFamily: 'Sarabun',
  },
  historyWrap: {
    marginBottom: 2,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5EDD8',
    borderWidth: 1,
    borderColor: '#D9C9A8',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  historyText: {
    fontSize: 12,
    color: '#6B4C2A',
    fontWeight: '600',
    fontFamily: 'Sarabun',
  },
});
