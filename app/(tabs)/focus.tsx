/**
 * focus.tsx
 *
 * Layout family: FULL-SCREEN HERO TIMER
 * Radically different from the other screens:
 * - Dark cream-paper-on-terracotta atmosphere (focus-mode dark surface)
 *   so the screen signals "different mode, pay attention"
 * - Single oversized animated timer as the hero element -- the Pomodoro
 *   ring breathes with a spring pulse when active
 * - Session preset selector: large confident tap targets (Streaks-style)
 * - Ambient toggles and next-task preview below the fold
 * - Today's focus total at bottom
 *
 * Motion: Reanimated spring breath on the ring, withTiming for start/pause.
 * No emoji as primary iconography. No decorative animations -- all motion
 * serves the interaction or communicates session state.
 */
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
  interpolate,
} from "react-native-reanimated";
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  Radius,
  Shadows,
  Animation,
} from "@/src/constants/theme";
import { ProgressRing } from "@/src/components/ProgressRing";

// ---------------------------------------------------------------------------
// Types + data
// ---------------------------------------------------------------------------

type Preset = {
  id: string;
  label: string;
  minutes: number;
  description: string;
};

const PRESETS: Preset[] = [
  { id: "25", label: "25 min", minutes: 25, description: "Classic Pomodoro" },
  { id: "45", label: "45 min", minutes: 45, description: "Deep work block" },
  { id: "90", label: "90 min", minutes: 90, description: "Ultradian rhythm" },
];

const NEXT_TASK = {
  title: "Review Q3 budget proposal",
  domain: "Work",
  quadrant: "Do Now",
  domainColor: Colors.domainWork,
};

const TOTAL_FOCUS_TODAY_MIN = 95; // minutes

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatFocusTotal(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

// ---------------------------------------------------------------------------
// Ambient toggle button
// ---------------------------------------------------------------------------

function AmbientToggle({
  icon,
  label,
  active,
  onPress,
  id,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  active: boolean;
  onPress: () => void;
  id: string;
}) {
  return (
    <TouchableOpacity
      id={id}
      style={[styles.ambientToggle, active && styles.ambientToggleActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? Colors.textOnDark : Colors.textTertiary}
      />
      <Text style={[styles.ambientLabel, active && styles.ambientLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function FocusScreen() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[0].minutes * 60);
  const [ambientSound, setAmbientSound] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reanimated ring breath
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(1);
  const startButtonScale = useSharedValue(1);

  const totalSeconds = selectedPreset.minutes * 60;
  const progress = 1 - secondsLeft / totalSeconds;

  // Start/stop breath animation
  useEffect(() => {
    if (isRunning) {
      ringScale.value = withRepeat(
        withSequence(
          withSpring(1.03, Animation.spring.breath),
          withSpring(1.0, Animation.spring.breath)
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(ringScale);
      ringScale.value = withSpring(1, Animation.spring.gentle);
    }
  }, [isRunning]);

  // Countdown
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setIsRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  function handlePresetSelect(preset: Preset) {
    if (isRunning) return;
    setSelectedPreset(preset);
    setSecondsLeft(preset.minutes * 60);
  }

  function handleStartPause() {
    startButtonScale.value = withSpring(0.92, Animation.spring.press, () => {
      startButtonScale.value = withSpring(1, Animation.spring.press);
    });
    setIsRunning((r) => !r);
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(selectedPreset.minutes * 60);
  }

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const startButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: startButtonScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Focus</Text>
          {isRunning ? (
            <View style={styles.runningBadge}>
              <View style={styles.runningDot} />
              <Text style={styles.runningLabel}>In session</Text>
            </View>
          ) : (
            <Text style={styles.headerSubtitle}>Enter your flow state</Text>
          )}
        </View>

        {/* ── Timer hero ── */}
        <View style={styles.timerHero}>
          {/* Ring + display */}
          <Animated.View style={[styles.ringWrap, ringStyle]}>
            <ProgressRing
              size={224}
              strokeWidth={12}
              progress={progress}
              trackColor={Colors.focusDarkMuted}
              fillColor={Colors.primaryLight}
            />
            {/* Timer face overlaid on ring */}
            <View style={styles.timerFace}>
              <Text style={styles.timerDisplay}>{formatTime(secondsLeft)}</Text>
              <Text style={styles.timerPhase}>
                {isRunning ? "Deep work" : secondsLeft === 0 ? "Session complete" : "Ready to begin"}
              </Text>
            </View>
          </Animated.View>

          {/* Controls */}
          <View style={styles.controls}>
            {/* Reset */}
            <TouchableOpacity
              id="focus-reset"
              style={styles.secondaryButton}
              onPress={handleReset}
              activeOpacity={0.75}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="refresh" size={22} color={Colors.textOnDark} style={{ opacity: 0.6 }} />
            </TouchableOpacity>

            {/* Start / Pause -- oversized confident tap target */}
            <Animated.View style={startButtonStyle}>
              <TouchableOpacity
                id="focus-start-button"
                style={styles.startButton}
                onPress={handleStartPause}
                activeOpacity={0.9}
              >
                <Ionicons
                  name={isRunning ? "pause" : "play"}
                  size={32}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </Animated.View>

            {/* Skip */}
            <TouchableOpacity
              id="focus-skip"
              style={styles.secondaryButton}
              onPress={handleReset}
              activeOpacity={0.75}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="play-skip-forward" size={22} color={Colors.textOnDark} style={{ opacity: 0.6 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Preset selector ── */}
        <View style={styles.presetsRow}>
          {PRESETS.map((preset) => {
            const active = selectedPreset.id === preset.id;
            return (
              <TouchableOpacity
                key={preset.id}
                id={`focus-preset-${preset.id}`}
                style={[styles.presetCard, active && styles.presetCardActive]}
                onPress={() => handlePresetSelect(preset)}
                activeOpacity={0.8}
                disabled={isRunning}
              >
                <Text style={[styles.presetLabel, active && styles.presetLabelActive]}>
                  {preset.label}
                </Text>
                <Text style={[styles.presetDesc, active && styles.presetDescActive]}>
                  {preset.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Ambient toggles ── */}
        <View style={styles.ambientRow}>
          <AmbientToggle
            id="focus-ambient-sound"
            icon="musical-notes-outline"
            label="Ambient sound"
            active={ambientSound}
            onPress={() => setAmbientSound((v) => !v)}
          />
          <AmbientToggle
            id="focus-dnd"
            icon="moon-outline"
            label="Do not disturb"
            active={doNotDisturb}
            onPress={() => setDoNotDisturb((v) => !v)}
          />
        </View>

        {/* ── Next task preview ── */}
        <View style={styles.nextTaskCard}>
          <Text style={styles.nextTaskOverline}>UP NEXT</Text>
          <View style={styles.nextTaskRow}>
            <View style={[styles.nextTaskDot, { backgroundColor: NEXT_TASK.domainColor }]} />
            <Text style={styles.nextTaskTitle} numberOfLines={1}>
              {NEXT_TASK.title}
            </Text>
            <View style={styles.nextTaskBadge}>
              <Text style={styles.nextTaskBadgeText}>{NEXT_TASK.quadrant}</Text>
            </View>
          </View>
        </View>

        {/* ── Today's focus total ── */}
        <View style={styles.focusTotalRow}>
          <Ionicons name="time-outline" size={16} color={Colors.textTertiary} />
          <Text style={styles.focusTotalText}>
            Today's focus:{" "}
            <Text style={styles.focusTotalValue}>
              {formatFocusTotal(TOTAL_FOCUS_TODAY_MIN)}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles -- dark terracotta atmosphere for focus mode
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.focusDark,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
    gap: Spacing.xl,
    flexGrow: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.xxl,
    color: Colors.textOnDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textOnDark,
    opacity: 0.5,
  },
  runningBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.success + "33",
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  runningDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
  },
  runningLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.success,
    letterSpacing: 0.5,
  },

  // Timer hero
  timerHero: {
    alignItems: "center",
    gap: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  ringWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  timerFace: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  timerDisplay: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.hero,
    color: Colors.textOnDark,
    letterSpacing: -2,
  },
  timerPhase: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    opacity: 0.55,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
  },
  startButton: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.textOnDark,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.xl,
  },
  secondaryButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.focusDarkSurface,
    justifyContent: "center",
    alignItems: "center",
  },

  // Presets
  presetsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  presetCard: {
    flex: 1,
    backgroundColor: Colors.focusDarkSurface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.xxs,
    borderWidth: 1.5,
    borderColor: Colors.focusDarkMuted,
    minHeight: 64,
    justifyContent: "center",
  },
  presetCardActive: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.primaryDark,
  },
  presetLabel: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.md,
    color: Colors.textOnDark,
    opacity: 0.6,
  },
  presetLabelActive: {
    opacity: 1,
    color: Colors.textOnDark,
  },
  presetDesc: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    opacity: 0.4,
    textAlign: "center",
  },
  presetDescActive: {
    opacity: 0.8,
  },

  // Ambient
  ambientRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  ambientToggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.focusDarkSurface,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.focusDarkMuted,
    minHeight: 44,
  },
  ambientToggleActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryLight,
  },
  ambientLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 0.3,
  },
  ambientLabelActive: {
    color: Colors.textOnDark,
  },

  // Next task
  nextTaskCard: {
    backgroundColor: Colors.focusDarkSurface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.focusDarkMuted,
  },
  nextTaskOverline: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    opacity: 0.4,
    letterSpacing: 1.5,
  },
  nextTaskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  nextTaskDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  nextTaskTitle: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textOnDark,
    opacity: 0.85,
  },
  nextTaskBadge: {
    backgroundColor: Colors.focusDarkMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  nextTaskBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    opacity: 0.6,
  },

  // Focus total
  focusTotalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  focusTotalText: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textOnDark,
    opacity: 0.45,
  },
  focusTotalValue: {
    fontFamily: FontFamily.headingMedium,
    color: Colors.textOnDark,
    opacity: 0.8,
  },
});
