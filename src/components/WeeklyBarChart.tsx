/**
 * WeeklyBarChart.tsx
 * Pure React Native bar chart for weekly activity.
 * No external charting dependency.
 * Renders 7 bars (Mon-Sun) with value labels and optional today highlight.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/src/constants/theme";

export type BarDatum = {
  day: string;   // "M" | "T" | "W" | "T" | "F" | "S" | "S"
  value: number; // raw value
  isToday?: boolean;
};

type Props = {
  data: BarDatum[];
  height?: number;
  fillColor?: string;
  todayColor?: string;
  trackColor?: string;
  showValues?: boolean;
};

export function WeeklyBarChart({
  data,
  height = 80,
  fillColor = Colors.chartFill,
  todayColor = Colors.primary,
  trackColor = Colors.chartTrack,
  showValues = false,
}: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height: showValues ? height + 20 : height }]}>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / max) * height);
        const color = d.isToday ? todayColor : fillColor;
        return (
          <View key={i} style={styles.barWrapper}>
            {showValues && d.value > 0 ? (
              <Text style={styles.valueLabel}>{d.value}</Text>
            ) : null}
            <View style={[styles.track, { height, backgroundColor: trackColor }]}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barH,
                    backgroundColor: color,
                    opacity: d.isToday ? 1 : 0.7,
                  },
                ]}
              />
            </View>
            <Text style={[styles.dayLabel, d.isToday && styles.dayLabelToday]}>
              {d.day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.xs,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xxs,
  },
  track: {
    width: "100%",
    borderRadius: Radius.sm,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: Radius.sm,
  },
  dayLabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  dayLabelToday: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
  },
  valueLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    color: Colors.textTertiary,
  },
});
