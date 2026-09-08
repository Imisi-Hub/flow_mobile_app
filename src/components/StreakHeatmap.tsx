/**
 * StreakHeatmap.tsx
 * 5-week calendar heatmap (Streaks-style) using pure React Native Views.
 * Each cell is a small rounded square, color-intensity driven by activity value.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/src/constants/theme";

export type HeatmapCell = {
  date: string;   // YYYY-MM-DD
  value: number;  // 0..4 intensity level
  isToday?: boolean;
};

type Props = {
  weeks: HeatmapCell[][];  // array of 7-day arrays, oldest first
  fillColor?: string;
  dayLabels?: string[];
};

const INTENSITY_ALPHA = ["08", "30", "60", "90", "FF"];

export function StreakHeatmap({
  weeks,
  fillColor = Colors.chartFill,
  dayLabels = ["M", "T", "W", "T", "F", "S", "S"],
}: Props) {
  return (
    <View style={styles.container}>
      {/* Day labels column */}
      <View style={styles.dayLabelsCol}>
        {dayLabels.map((d, i) => (
          <Text key={i} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>
      {/* Weeks columns */}
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekCol}>
            {week.map((cell, di) => {
              const alpha = INTENSITY_ALPHA[Math.min(cell.value, 4)];
              const bg = cell.value === 0
                ? Colors.chartGrid
                : fillColor + alpha;
              return (
                <View
                  key={di}
                  style={[
                    styles.cell,
                    { backgroundColor: bg },
                    cell.isToday && styles.cellToday,
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  dayLabelsCol: {
    gap: 3,
    paddingTop: 2,
  },
  dayLabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 9,
    color: Colors.textTertiary,
    width: 10,
    height: 12,
    lineHeight: 12,
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    gap: 3,
  },
  weekCol: {
    flex: 1,
    gap: 3,
  },
  cell: {
    height: 12,
    borderRadius: Radius.xs,
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
});
