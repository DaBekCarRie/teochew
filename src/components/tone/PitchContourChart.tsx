import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import type { ToneInfo } from '../../utils/toneData';
import { contourToPoints, isShortTone } from '../../utils/pitchContourPath';

interface PitchContourChartProps {
  tones: ToneInfo[];
  highlightTones?: number[];
  /** Tone number currently playing audio — drives pulse on X-axis badge */
  playingTone?: number | null;
  onTonePress?: (toneNumber: number) => void;
}

const CHART_HEIGHT = 160;
const CHART_INNER_HEIGHT = 100;
const Y_AXIS_WIDTH = 28;
const X_PADDING = 20;

function ToneLine({
  tone,
  colX,
  colWidth,
  isHighlighted,
  isFaded,
  onPress,
}: {
  tone: ToneInfo;
  colX: number;
  colWidth: number;
  isHighlighted: boolean;
  isFaded: boolean;
  onPress: () => void;
}) {
  const points = contourToPoints(tone.pitch_contour);
  const short = isShortTone(tone.pitch_contour);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isFaded ? 0.15 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFaded, opacity]);

  if (points.length === 0) return null;

  const lineThickness = isHighlighted ? 4 : 3;
  const dotRadius = isHighlighted ? 7 : 5;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: colX,
        width: colWidth,
        height: CHART_INNER_HEIGHT,
        opacity,
      }}
    >
      {/* Draw line segments between consecutive points */}
      {points.map((pt, i) => {
        if (i === points.length - 1) return null;
        const next = points[i + 1];
        const x1 = X_PADDING + pt.x * (colWidth - X_PADDING * 2);
        const y1 = pt.y * CHART_INNER_HEIGHT;
        const x2 = X_PADDING + next.x * (colWidth - X_PADDING * 2);
        const y2 = next.y * CHART_INNER_HEIGHT;
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: x1,
              top: y1 - lineThickness / 2,
              width: length,
              height: lineThickness,
              backgroundColor: tone.color,
              borderRadius: lineThickness / 2,
              transformOrigin: '0 50%',
              transform: [{ rotate: `${angle}deg` }],
            }}
          />
        );
      })}

      {/* Draw dots at each point */}
      {points.map((pt, i) => {
        const cx = X_PADDING + pt.x * (colWidth - X_PADDING * 2);
        const cy = pt.y * CHART_INNER_HEIGHT;
        return (
          <View
            key={`dot-${i}`}
            style={{
              position: 'absolute',
              left: cx - dotRadius,
              top: cy - dotRadius,
              width: dotRadius * 2,
              height: dotRadius * 2,
              borderRadius: dotRadius,
              backgroundColor: tone.color,
              borderWidth: short ? 2 : 0,
              borderColor: '#FAF6EE',
            }}
          />
        );
      })}

      {/* Invisible tap target */}
      <Pressable
        onPress={onPress}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        accessibilityRole="button"
        accessibilityLabel={`เสียงที่ ${tone.number} ${tone.name_th} pitch ${tone.pitch_contour}`}
      />
    </Animated.View>
  );
}

export function PitchContourChart({
  tones,
  highlightTones = [],
  playingTone,
  onTonePress,
}: PitchContourChartProps) {
  const colWidth = 40;
  const totalWidth = Y_AXIS_WIDTH + tones.length * colWidth;
  const compareMode = highlightTones.length > 0;

  return (
    <View
      style={{
        backgroundColor: '#F5EDD8',
        borderWidth: 1,
        borderColor: '#D9C9A8',
        borderRadius: 14,
        padding: 12,
        marginTop: 4,
      }}
      accessibilityRole="image"
      accessibilityLabel="กราฟ pitch contour 8 เสียงแต้จิ๋ว"
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: '#A08060',
          marginBottom: 8,
          letterSpacing: 0.5,
        }}
      >
        PITCH CONTOUR
      </Text>

      <View style={{ height: CHART_HEIGHT }}>
        {/* Y-axis labels */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: Y_AXIS_WIDTH,
            height: CHART_INNER_HEIGHT,
          }}
        >
          {[5, 4, 3, 2, 1].map((level) => (
            <View
              key={level}
              style={{
                position: 'absolute',
                top: ((5 - level) / 4) * CHART_INNER_HEIGHT - 8,
                left: 0,
                width: Y_AXIS_WIDTH - 4,
                alignItems: 'flex-end',
              }}
            >
              <Text style={{ fontSize: 10, color: '#A08060' }}>{level}</Text>
            </View>
          ))}
        </View>

        {/* Grid lines */}
        <View
          style={{
            position: 'absolute',
            left: Y_AXIS_WIDTH,
            right: 0,
            top: 0,
            height: CHART_INNER_HEIGHT,
          }}
        >
          {[5, 4, 3, 2, 1].map((level) => (
            <View
              key={level}
              style={{
                position: 'absolute',
                top: ((5 - level) / 4) * CHART_INNER_HEIGHT,
                left: 0,
                right: 0,
                height: 0.5,
                backgroundColor: '#E8D9B8',
              }}
            />
          ))}
        </View>

        {/* Tone lines */}
        <View
          style={{
            position: 'absolute',
            left: Y_AXIS_WIDTH,
            top: 0,
            width: totalWidth - Y_AXIS_WIDTH,
            height: CHART_INNER_HEIGHT,
          }}
        >
          {tones.map((tone, idx) => (
            <ToneLine
              key={tone.number}
              tone={tone}
              colX={idx * colWidth}
              colWidth={colWidth}
              isHighlighted={highlightTones.includes(tone.number) || playingTone === tone.number}
              isFaded={compareMode && !highlightTones.includes(tone.number)}
              onPress={() => onTonePress?.(tone.number)}
            />
          ))}
        </View>

        {/* X-axis tone number labels */}
        <View
          style={{
            position: 'absolute',
            left: Y_AXIS_WIDTH,
            top: CHART_INNER_HEIGHT + 8,
            flexDirection: 'row',
          }}
        >
          {tones.map((tone) => {
            const active = highlightTones.includes(tone.number) || playingTone === tone.number;
            return (
              <View key={tone.number} style={{ width: colWidth, alignItems: 'center' }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: active ? tone.color : '#EDE0C4',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: active ? '#FAF6EE' : '#A08060',
                    }}
                  >
                    {tone.number}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
