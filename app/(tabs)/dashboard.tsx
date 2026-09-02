import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
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

// ─── Dashboard Screen ─────────────────────────────────────────────────────────
// Placeholder for the main hub screen.
// Full implementation (Priority Matrix summary, daily spark, quick-add, streaks)
// will be built in the feature/dashboard pass.

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning ✦</Text>
            <Text style={styles.headerTitle}>Your Dashboard</Text>
          </View>
          <TouchableOpacity
            id="dashboard-settings-button"
            style={styles.avatarButton}
            onPress={() => router.push("/settings")}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle-outline" size={36} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Empty state ── */}
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="grid-outline" size={40} color={Colors.primaryLight} />
          </View>
          <Text style={styles.emptyTitle}>Your flow starts here</Text>
          <Text style={styles.emptyBody}>
            Your priority matrix, daily spark, streaks, and quick-add tasks
            will live here. Coming in the next sprint.
          </Text>
        </View>

        {/* ── Placeholder quadrant cards ── */}
        <Text style={styles.sectionLabel}>PRIORITY MATRIX</Text>
        <View style={styles.quadrantGrid}>
          {[
            { id: "Q1", label: "Do Now", color: Colors.quadrantQ1 },
            { id: "Q2", label: "Schedule", color: Colors.quadrantQ2 },
            { id: "Q3", label: "Delegate", color: Colors.quadrantQ3 },
            { id: "Q4", label: "Eliminate", color: Colors.quadrantQ4 },
          ].map((q) => (
            <View
              key={q.id}
              style={[styles.quadrantCard, { borderLeftColor: q.color }]}
            >
              <Text style={[styles.quadrantLabel, { color: q.color }]}>
                {q.id}
              </Text>
              <Text style={styles.quadrantName}>{q.label}</Text>
              <Text style={styles.quadrantEmpty}>— empty —</Text>
            </View>
          ))}
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

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  greeting: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  },
  headerTitle: {
    ...TextStyles.h2,
  },
  avatarButton: {
    padding: Spacing.xs,
  },

  // Empty state
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

  // Section
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 2,
    marginTop: Spacing.sm,
  },

  // Quadrant grid
  quadrantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  quadrantCard: {
    flex: 1,
    minWidth: "44%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderLeftWidth: 3,
    gap: Spacing.xs,
    ...Shadows.xs,
  },
  quadrantLabel: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.lg,
  },
  quadrantName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  quadrantEmpty: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});
