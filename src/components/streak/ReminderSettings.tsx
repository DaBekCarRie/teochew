import React, { useState } from 'react';
import { View, Text, Switch, Pressable, Platform, Modal } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { ReminderSettings as ReminderSettingsType } from '../../types/dictionary';

interface ReminderSettingsProps {
  settings: ReminderSettingsType;
  onUpdate: (partial: Partial<ReminderSettingsType>) => void;
}

const DAY_LABELS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

function parseTime(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function ReminderSettings({ settings, onUpdate }: ReminderSettingsProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  function toggleDay(day: number) {
    const current = settings.days;
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    onUpdate({ days: next.sort((a, b) => a - b) });
  }

  function handleTimeChange(_event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selected) {
      onUpdate({ time: formatTime(selected) });
    }
  }

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        padding: 16,
        marginTop: 16,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1A0E', marginBottom: 16 }}>
        การเตือนรายวัน
      </Text>

      {/* Toggle row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 4,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 14, color: '#2C1A0E' }}>เปิดใช้การแจ้งเตือน</Text>
        <Switch
          value={settings.enabled}
          onValueChange={(val) => onUpdate({ enabled: val })}
          trackColor={{ false: '#D9C9A8', true: '#C9A84C' }}
          thumbColor="#FAF6EE"
        />
      </View>

      {/* Time picker row */}
      <Pressable
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 4,
          marginBottom: 16,
          opacity: settings.enabled ? 1 : 0.4,
        })}
        onPress={() => settings.enabled && setShowTimePicker(true)}
        disabled={!settings.enabled}
        accessibilityRole="button"
        accessibilityLabel={`เวลาแจ้งเตือน ${settings.time}`}
      >
        <Text style={{ fontSize: 14, color: '#2C1A0E' }}>เวลาแจ้งเตือน</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#9A7A2E' }}>{settings.time}</Text>
      </Pressable>

      {/* Time picker modal for iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <Pressable
            style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}
            onPress={() => setShowTimePicker(false)}
          >
            <View
              style={{
                backgroundColor: '#FAF6EE',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 16,
              }}
            >
              <DateTimePicker
                value={parseTime(settings.time)}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                locale="th"
              />
              <Pressable
                style={{
                  backgroundColor: '#B5451B',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginTop: 8,
                }}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={{ color: '#FAF6EE', fontWeight: '600', fontSize: 15 }}>ตกลง</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Android time picker */}
      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={parseTime(settings.time)}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Day selector */}
      <View style={{ opacity: settings.enabled ? 1 : 0.4 }}>
        <Text style={{ fontSize: 13, color: '#A08060', marginBottom: 8 }}>วันที่แจ้งเตือน</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {DAY_LABELS.map((label, idx) => {
            const isActive = settings.days.includes(idx);
            return (
              <Pressable
                key={idx}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isActive ? '#C9A84C' : '#EDE0C4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => settings.enabled && toggleDay(idx)}
                disabled={!settings.enabled}
                accessibilityRole="button"
                accessibilityLabel={`วัน${label}`}
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: isActive ? '#FAF6EE' : '#A08060',
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
