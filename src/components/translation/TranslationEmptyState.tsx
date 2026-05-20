import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EXAMPLES = [
  { sourceLang: '🇹🇭', sourceText: 'สวัสดี', targetLang: '🇨🇳', targetText: '你好' },
  { sourceLang: '🇬🇧', sourceText: 'thank you', targetLang: '🇨🇳', targetText: '谢谢' },
  { sourceLang: '🇹🇭', sourceText: 'อร่อยมาก', targetLang: '🇬🇧', targetText: 'very delicious' },
];

export function TranslationEmptyState() {
  return (
    <View style={styles.wrap}>
      {/* Ambient header */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>潮</Text>
        </View>
        <Text style={styles.prompt}>พิมพ์คำหรือประโยคด้านบน</Text>
        <View style={styles.pillRow}>
          {['🇹🇭 ไทย', '🇨🇳 จีนกลาง', '🇬🇧 อังกฤษ'].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>ตัวอย่าง</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Example translation cards */}
      <View style={styles.exampleList}>
        {EXAMPLES.map((ex, i) => (
          <View key={i} style={styles.exampleCard}>
            <View style={styles.exampleSource}>
              <Text style={styles.exampleFlag}>{ex.sourceLang}</Text>
              <Text style={styles.exampleSourceText}>{ex.sourceText}</Text>
            </View>
            <View style={styles.exampleDivider} />
            <View style={styles.exampleTarget}>
              <Text style={styles.exampleFlag}>{ex.targetLang}</Text>
              <Text style={styles.exampleTargetText}>{ex.targetText}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EDE0C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#9A7A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  iconText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#C9A84C',
  },
  prompt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1A0E',
    textAlign: 'center',
    fontFamily: 'Sarabun',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: '#F0E6CC',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#D9C9A8',
  },
  pillText: {
    fontSize: 11,
    color: '#7A5E2A',
    fontWeight: '500',
    fontFamily: 'Sarabun',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5D8BE',
  },
  dividerLabel: {
    fontSize: 11,
    color: '#B8997A',
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'Sarabun',
  },
  exampleList: {
    gap: 8,
  },
  exampleCard: {
    backgroundColor: '#FAF6EE',
    borderWidth: 1,
    borderColor: '#E5D8BE',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  exampleSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exampleTarget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exampleFlag: {
    fontSize: 18,
  },
  exampleSourceText: {
    fontSize: 14,
    color: '#A08060',
    fontFamily: 'Sarabun',
    fontWeight: '500',
  },
  exampleTargetText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1A0E',
  },
  exampleDivider: {
    height: 1,
    backgroundColor: '#EDE0C4',
    marginLeft: 28,
  },
});
