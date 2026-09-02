import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
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

// ─── Focus Screen ─────────────────────────────────────────────────────────────
// Placeholder for the Focus Timer (Pomodoro-style deep work sessions).
// Full implementation (Reanimated countdown, session log, biometric gate)
// will be built in the feature/focus pass.

const TIMER_PRESETS = [
  { id: "25", label: "25 min", description: "Classic Pomodoro" },
  { id: "45", label: "45 min", description: "Deep work block" },
  { id: "90", label: "90 min", description: "Ultradian rhythm" },
];

export default function FocusScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Focus</Text>
          <Text style={styles.headerSubtitle}>Enter your flow state</Text>
        </View>

        {/* ── Timer placeholder ── */}
        <View style={styles.timerCard}>
          <View style={styles.timerFace}>
            <Text style={styles.timerDisplay}>25:00</Text>
            <Text style={styles.timerStatus}>Ready to begin</Text>
          </View>
          <TouchableOpacity
            id="focus-start-button"
            style={styles.startButton}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={28} color={Colors.textOnDark} />
          </TouchableOpacity>
          <Text style={styles.timerNote}>
            Full timer with Reanimated animations coming in the feature/focus pass.
          </Text>
        </View>

        {/* ── Preset selector ── */}
        <Text style={styles.sectionLabel}>SESSION LENGTH</Text>
        <View style={styles.presetsRow}>
          {TIMER_PRESETS.map((preset, idx) => (
            <TouchableOpacity
              key={preset.id}
              id={`focus-preset-${preset.id}`}
              style={[styles.presetCard, idx === 0 && styles.presetCardActive]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.presetLabel,
                  idx === 0 && styles.presetLabelActive,
                ]}
              >
                {preset.label}
              </Text>
              <Text style={styles.presetDescription}>{preset.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Empty session log ── */}
        <Text style={styles.sectionLabel}>RECENT SESSIONS</Text>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="hourglass-outline" size={36} color={Colors.primaryLight} />
          </View>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyBody}>
            Your completed focus sessions will be logged here, along with
            the tasks you worked on and time spent.
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

  // Timer
  timerCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
    alignItems: "center",
    gap: Spacing.lg,
    ...Shadows.lg,
  },
  timerFace: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  timerDisplay: {
    fontFamily: FontFamily.headingBold,
    fontSize: 64,
    color: Colors.textOnDark,
    letterSpacing: -2,
  },
  timerStatus: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textOnDark,
    opacity: 0.7,
    letterSpacing: 1,
  },
  startButton: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  timerNote: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    opacity: 0.55,
    textAlign: "center",
  },

  // Presets
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  presetsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  presetCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    alignItems: "center",
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    ...Shadows.xs,
  },
  presetCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  presetLabel: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  presetLabelActive: {
    color: Colors.primary,
  },
  presetDescription: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: "center",
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
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
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
