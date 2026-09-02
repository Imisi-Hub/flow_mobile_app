import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  Radius,
  Shadows,
  TextStyles,
} from "@/src/constants/theme";

// ─── Insights Screen ──────────────────────────────────────────────────────────
// Placeholder for analytics, streaks, and health-garden data.
// Full implementation (charts, streak calendar, health integrations, achievements)
// will be built in the feature/insights pass.
//
// TODO: Wire up HealthKit (iOS) / Google Fit (Android) once native modules
//       are configured. See /src/features/health-garden/ for the integration point.

export default function InsightsScreen() {
  const statCards = [
    {
      id: "streak",
      label: "Current Streak",
      value: "—",
      unit: "days",
      icon: "flame-outline" as const,
      color: Colors.primary,
    },
    {
      id: "focus-time",
      label: "Focus Time Today",
      value: "—",
      unit: "min",
      icon: "timer-outline" as const,
      color: Colors.sage,
    },
    {
      id: "tasks-done",
      label: "Tasks Completed",
      value: "—",
      unit: "this week",
      icon: "checkmark-circle-outline" as const,
      color: Colors.domainFamily,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
          <Text style={styles.headerSubtitle}>
            Your productivity at a glance
          </Text>
        </View>

        {/* ── Stat cards (placeholder) ── */}
        <View style={styles.statsGrid}>
          {statCards.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View
                style={[
                  styles.statIconWrap,
                  { backgroundColor: stat.color + "22" },
                ]}
              >
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statUnit}>{stat.unit}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Health garden teaser ── */}
        <View style={styles.gardenCard}>
          <Ionicons
            name="leaf-outline"
            size={32}
            color={Colors.sage}
            style={{ marginBottom: Spacing.sm }}
          />
          <Text style={styles.gardenTitle}>Health Garden</Text>
          <Text style={styles.gardenBody}>
            Your biometric data (steps, heart rate, sleep) will bloom into a
            living garden here. Connect HealthKit or Google Fit to get started.
          </Text>
          {/* TODO: Uncomment when react-native-health / google-fit are configured */}
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>

        {/* ── Empty state ── */}
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="bar-chart-outline" size={40} color={Colors.primaryLight} />
          </View>
          <Text style={styles.emptyTitle}>No data yet</Text>
          <Text style={styles.emptyBody}>
            Complete your first focus session and tasks to start seeing
            patterns and insights here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: Spacing.section,
  },
  header: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    ...TextStyles.h2,
  },
  headerSubtitle: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.base,
    color: Colors.textTertiary,
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    alignItems: "center",
    gap: Spacing.xs,
    ...Shadows.xs,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  statUnit: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  statLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  // Garden
  gardenCard: {
    backgroundColor: Colors.sageMuted,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.xs,
    ...Shadows.xs,
  },
  gardenTitle: {
    ...TextStyles.h4,
    color: Colors.sageDark,
  },
  gardenBody: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.sageDark,
    textAlign: "center",
    lineHeight: FontSize.sm * 1.5,
  },
  comingSoonBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.sage,
    borderRadius: Radius.pill,
  },
  comingSoonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    letterSpacing: 1,
  },

  // Empty
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
    alignItems: "center",
    gap: Spacing.md,
    ...Shadows.sm,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...TextStyles.h4,
    textAlign: "center",
  },
  emptyBody: {
    ...TextStyles.body,
    textAlign: "center",
    color: Colors.textTertiary,
  },
});
