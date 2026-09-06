/**
 * ProgressRing.tsx
 * Pure React Native circular ring using View + borderRadius + overflow.
 * Works without react-native-svg -- uses a clip technique with two half-circles.
 * Suitable for progress values 0..1.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize } from "@/src/constants/theme";

type Props = {
  size: number;
  strokeWidth: number;
  progress: number; // 0..1
  trackColor?: string;
  fillColor?: string;
  centerLabel?: string;
  centerSublabel?: string;
  centerLabelSize?: number;
};

export function ProgressRing({
  size,
  strokeWidth,
  progress,
  trackColor = Colors.chartTrack,
  fillColor = Colors.primary,
  centerLabel,
  centerSublabel,
  centerLabelSize = FontSize.xxl,
}: Props) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const halfSize = size / 2;
  // Two-half-circle clip technique:
  // We render a full track circle, then layer a filled arc on top.
  // For progress <= 0.5 we rotate the right half; for > 0.5 we show full right + rotate left.
  const angle = clampedProgress * 360;
  const rightAngle = Math.min(angle, 180);
  const leftAngle = Math.max(0, angle - 180);

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Track */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: halfSize,
            borderWidth: strokeWidth,
            borderColor: trackColor,
            position: "absolute",
          },
        ]}
      />

      {/* Right half fill */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: halfSize,
          position: "absolute",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: halfSize,
            height: size,
            position: "absolute",
            right: 0,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: size,
              height: size,
              borderRadius: halfSize,
              borderWidth: strokeWidth,
              borderColor: fillColor,
              position: "absolute",
              right: 0,
              transform: [{ rotate: `${rightAngle - 180}deg` }],
            }}
          />
        </View>
      </View>

      {/* Left half fill (only shown for progress > 0.5) */}
      {leftAngle > 0 && (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: halfSize,
            position: "absolute",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: halfSize,
              height: size,
              position: "absolute",
              left: 0,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: size,
                height: size,
                borderRadius: halfSize,
                borderWidth: strokeWidth,
                borderColor: fillColor,
                position: "absolute",
                left: 0,
                transform: [{ rotate: `${leftAngle}deg` }],
              }}
            />
          </View>
        </View>
      )}

      {/* Center content */}
      {centerLabel ? (
        <View style={styles.center}>
          <Text
            style={[styles.centerLabel, { fontSize: centerLabelSize }]}
          >
            {centerLabel}
          </Text>
          {centerSublabel ? (
            <Text style={styles.centerSublabel}>{centerSublabel}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {},
  center: {
    alignItems: "center",
    gap: 2,
    position: "absolute",
  },
  centerLabel: {
    fontFamily: FontFamily.headingBold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  centerSublabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: "center",
  },
});
