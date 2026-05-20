import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function DiasporaOriginCard() {
  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
      accessibilityRole="button"
      accessibilityLabel="ที่มาของชาวแต้จิ๋ว"
    >
      <View style={styles.card}>
        <View style={styles.charBlock}>
          <Text style={styles.originChar}>潮</Text>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>ที่มาของชาวแต้จิ๋ว</Text>
          <Text style={styles.subtitle}>潮汕 → ไทย · ศตวรรษ 18–19</Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#C9A84C" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    backgroundColor: '#FFFDF5',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#C9A84C',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#2C1A0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  charBlock: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FEF6E0',
    borderWidth: 1,
    borderColor: '#E5C97A',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  originChar: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2C1A0E',
    lineHeight: 30,
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1A0E',
    fontFamily: 'Sarabun',
  },
  subtitle: {
    fontSize: 12,
    color: '#A08060',
    fontFamily: 'Sarabun',
  },
});
