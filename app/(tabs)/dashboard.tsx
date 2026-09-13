/**
 * dashboard.tsx
 *
 * Layout family: TIMELINE STRIP + DOMAIN ROWS
 * Top section: date context, greeting, streak/XP pill -- scannable in one glance.
 * Primary action: Quick Add button (above fold, terracotta FAB-style row).
 * Body: today's tasks grouped by domain (Work / Personal / Family), each row
 *   a large, confident tap target with a swipe-gesture affordance.
 * Hydration/break prompt is a scheduled first-class card in the flow timeline
 *   (Structured-style), not a dismissible toast.
 * Weekly activity chart at bottom for rhythm awareness.
 *
 * Motion: spring-based check animation on TaskRow via Reanimated.
 * No emoji as primary iconography -- Ionicons throughout.
 * No cartoon badges -- streak is expressed as a bold number + bar.
 */
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  Radius,
  Shadows,
  TextStyles,
  Animation,
} from "@/src/constants/theme";
import { WeeklyBarChart, BarDatum } from "@/src/components/WeeklyBarChart";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Task = {
  id: string;
  title: string;
  domain: "work" | "personal" | "family";
  quadrant: "Q1" | "Q2" | "Q3" | "Q4";
  done: boolean;
  time?: string;
};

// ---------------------------------------------------------------------------
// Sample data (replace with real data layer in feature/data pass)
// ---------------------------------------------------------------------------

const TODAY_TASKS: Task[] = [
  { id: "t1", title: "Review Q3 budget proposal", domain: "work", quadrant: "Q1", done: false, time: "9:00" },
  { id: "t2", title: "Prepare board presentation", domain: "work", quadrant: "Q1", done: false, time: "11:00" },
  { id: "t3", title: "1:1 with direct reports", domain: "work", quadrant: "Q2", done: true, time: "10:00" },
  { id: "t4", title: "Book dentist for Maya", domain: "family", quadrant: "Q2", done: false },
  { id: "t5", title: "30-min walk", domain: "personal", quadrant: "Q2", done: false, time: "13:00" },
  { id: "t6", title: "Respond to Tom re: project", domain: "work", quadrant: "Q3", done: false },
];

const WEEKLY_DATA: BarDatum[] = [
  { day: "M", value: 4, isToday: false },
  { day: "T", value: 6, isToday: false },
  { day: "W", value: 3, isToday: false },
  { day: "T", value: 7, isToday: false },
  { day: "F", value: 5, isToday: true },
  { day: "S", value: 0, isToday: false },
  { day: "S", value: 0, isToday: false },
];

const DOMAIN_META = {
  work:     { label: "Work",     color: Colors.domainWork,     icon: "briefcase-outline" as const },
  personal: { label: "Personal", color: Colors.domainPersonal, icon: "person-outline" as const },
  family:   { label: "Family",   color: Colors.domainFamily,   icon: "people-outline" as const },
};

const QUADRANT_LABELS = {
  Q1: "Do Now",
  Q2: "Schedule",
  Q3: "Delegate",
  Q4: "Eliminate",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ---------------------------------------------------------------------------
// TaskRow component with spring check animation
// ---------------------------------------------------------------------------

type TaskRowProps = {
  task: Task;
  onToggle: (id: string) => void;
};

function TaskRow({ task, onToggle }: TaskRowProps) {
  const meta = DOMAIN_META[task.domain];
  const scale = useSharedValue(1);
  const checkProgress = useSharedValue(task.done ? 1 : 0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkProgress.value,
    transform: [{ scale: checkProgress.value }],
  }));

  const rowStyle = useAnimatedStyle(() => ({
    opacity: task.done ? 0.5 : 1,
  }));

  function handlePress() {
    scale.value = withSpring(0.96, Animation.spring.press, () => {
      scale.value = withSpring(1, Animation.spring.press);
    });
    checkProgress.value = withSpring(
      task.done ? 0 : 1,
      Animation.spring.snappy
    );
    onToggle(task.id);
  }

  return (
    <Animated.View style={[styles.taskRow, rowStyle]}>
      <Pressable
        id={`task-toggle-${task.id}`}
        style={styles.taskPressable}
        onPress={handlePress}
        android_ripple={{ color: Colors.borderLight }}
      >
        <Animated.View style={animStyle}>
          {/* Check circle */}
          <View
            style={[
              styles.checkCircle,
              { borderColor: meta.color },
              task.done && { backgroundColor: meta.color },
            ]}
          >
            {task.done && (
              <Animated.View style={checkStyle}>
                <Ionicons name="checkmark" size={12} color={Colors.textOnDark} />
              </Animated.View>
            )}
          </View>
        </Animated.View>

        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              task.done && styles.taskTitleDone,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          <View style={styles.taskMeta}>
            <View style={[styles.quadrantPip, { backgroundColor: meta.color + "33" }]}>
              <Text style={[styles.quadrantPipText, { color: meta.color }]}>
                {QUADRANT_LABELS[task.quadrant]}
              </Text>
            </View>
            {task.time ? (
              <Text style={styles.taskTime}>{task.time}</Text>
            ) : null}
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={14}
          color={Colors.borderLight}
          style={{ marginLeft: Spacing.xs }}
        />
      </Pressable>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Domain section
// ---------------------------------------------------------------------------

type DomainSectionProps = {
  domain: "work" | "personal" | "family";
  tasks: Task[];
  onToggle: (id: string) => void;
};

function DomainSection({ domain, tasks, onToggle }: DomainSectionProps) {
  const meta = DOMAIN_META[domain];
  const done = tasks.filter((t) => t.done).length;

  return (
    <View style={styles.domainSection}>
      <View style={styles.domainHeader}>
        <View style={[styles.domainDot, { backgroundColor: meta.color }]} />
        <Text style={styles.domainLabel}>{meta.label}</Text>
        <Text style={styles.domainCount}>
          {done}/{tasks.length}
        </Text>
      </View>
      <View style={styles.domainCard}>
        {tasks.map((task, idx) => (
          <React.Fragment key={task.id}>
            <TaskRow task={task} onToggle={onToggle} />
            {idx < tasks.length - 1 && <View style={styles.taskDivider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// HydrationPrompt -- first-class scheduled content card (Structured-style)
// ---------------------------------------------------------------------------

function HydrationPrompt() {
  return (
    <View style={styles.hydrationCard}>
      <View style={styles.hydrationLeft}>
        <View style={styles.hydrationIconWrap}>
          <Ionicons name="water-outline" size={20} color={Colors.info} />
        </View>
        <View style={styles.hydrationText}>
          <Text style={styles.hydrationTitle}>Hydration check</Text>
          <Text style={styles.hydrationBody}>2 glasses since morning</Text>
        </View>
      </View>
      <Pressable id="hydration-log" style={styles.hydrationAction}>
        <Text style={styles.hydrationActionText}>Log</Text>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<Task[]>(TODAY_TASKS);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const workTasks = tasks.filter((t) => t.domain === "work");
  const personalTasks = tasks.filter((t) => t.domain === "personal");
  const familyTasks = tasks.filter((t) => t.domain === "family");

  const totalDone = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const streakDays = 7;
  const xpToday = 240;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.todayLabel}>{getTodayLabel()}</Text>
            <Text style={styles.greeting}>{getGreeting()}</Text>
          </View>
          <TouchableOpacity
            id="dashboard-settings-button"
            style={styles.avatarButton}
            onPress={() => router.push("/settings")}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>A</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Streak + XP row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Ionicons name="flame" size={14} color={Colors.primary} />
            <Text style={styles.statPillValue}>{streakDays}</Text>
            <Text style={styles.statPillLabel}>day streak</Text>
          </View>
          <View style={styles.statPill}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={styles.statPillValue}>{xpToday}</Text>
            <Text style={styles.statPillLabel}>XP today</Text>
          </View>
          <View style={[styles.statPill, styles.statPillProgress]}>
            <Text style={styles.statPillValue}>{totalDone}/{totalTasks}</Text>
            <Text style={styles.statPillLabel}>tasks done</Text>
          </View>
        </View>

        {/* ── Quick Add ── */}
        <TouchableOpacity
          id="dashboard-quick-add"
          style={styles.quickAdd}
          activeOpacity={0.85}
        >
          <View style={styles.quickAddIcon}>
            <Ionicons name="add" size={20} color={Colors.textOnDark} />
          </View>
          <Text style={styles.quickAddText}>Add a task to today</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* ── Hydration prompt (scheduled first-class content) ── */}
        <HydrationPrompt />

        {/* ── Today's tasks by domain ── */}
        <Text style={styles.sectionLabel}>TODAY'S FOCUS</Text>

        {workTasks.length > 0 && (
          <DomainSection
            domain="work"
            tasks={workTasks}
            onToggle={toggleTask}
          />
        )}
        {personalTasks.length > 0 && (
          <DomainSection
            domain="personal"
            tasks={personalTasks}
            onToggle={toggleTask}
          />
        )}
        {familyTasks.length > 0 && (
          <DomainSection
            domain="family"
            tasks={familyTasks}
            onToggle={toggleTask}
          />
        )}

        {/* ── Weekly rhythm chart ── */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>This week</Text>
            <Text style={styles.chartSubtitle}>tasks completed per day</Text>
          </View>
          <WeeklyBarChart data={WEEKLY_DATA} height={72} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
    gap: Spacing.base,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xs,
  },
  headerLeft: {
    gap: 2,
  },
  todayLabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  greeting: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatarButton: {
    marginTop: 2,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.base,
    color: Colors.textOnDark,
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  statPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadows.xs,
  },
  statPillProgress: {
    backgroundColor: Colors.primaryMuted,
  },
  statPillValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  statPillLabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    flexShrink: 1,
  },

  // Quick add
  quickAdd: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.xs,
  },
  quickAddIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  quickAddText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textTertiary,
  },

  // Hydration card
  hydrationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.info + "12",
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  hydrationLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  hydrationIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: Colors.info + "22",
    justifyContent: "center",
    alignItems: "center",
  },
  hydrationText: {
    gap: 2,
  },
  hydrationTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  hydrationBody: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  hydrationAction: {
    backgroundColor: Colors.info,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minWidth: 44,
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  hydrationActionText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    letterSpacing: 0.5,
  },

  // Section
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 2,
    marginTop: Spacing.sm,
  },

  // Domain section
  domainSection: {
    gap: Spacing.xs,
  },
  domainHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingLeft: Spacing.xxs,
  },
  domainDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  domainLabel: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  domainCount: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  domainCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.xs,
  },

  // Task row
  taskRow: {},
  taskPressable: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 56,
    gap: Spacing.md,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  taskContent: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: FontSize.base * 1.3,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: Colors.textTertiary,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  quadrantPip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  quadrantPipText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    letterSpacing: 0.3,
  },
  taskTime: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  taskDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.base + 24 + Spacing.md, // align past check circle
  },

  // Chart
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.base,
    marginTop: Spacing.sm,
    ...Shadows.xs,
  },
  chartHeader: {
    gap: 2,
  },
  chartTitle: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  chartSubtitle: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
});
