/**
 * projects.tsx
 *
 * Layout family: KANBAN-COLUMN SUMMARY + TASK LIST
 * Structurally distinct from Dashboard: no header greeting, no stats pills.
 * Instead: full-bleed domain header tabs at top, project progress cards
 * (horizontal progress bar + task count), unified task list below, quick filters.
 *
 * Progress expressed as a linear progress bar (Streaks-style data viz),
 * not badges or icons.
 * Touch targets: domain filter buttons are pill-row (min 44pt height).
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { WeeklyBarChart, BarDatum } from "@/src/components/WeeklyBarChart";

// ---------------------------------------------------------------------------
// Types + sample data
// ---------------------------------------------------------------------------

type Domain = "all" | "work" | "personal" | "family";

type Project = {
  id: string;
  name: string;
  domain: "work" | "personal" | "family";
  tasksTotal: number;
  tasksDone: number;
  dueLabel?: string;
};

type ProjectTask = {
  id: string;
  title: string;
  project: string;
  domain: "work" | "personal" | "family";
  priority: "high" | "medium" | "low";
  done: boolean;
};

const PROJECTS: Project[] = [
  { id: "p1", name: "Q3 Strategy", domain: "work", tasksTotal: 12, tasksDone: 8, dueLabel: "Due Friday" },
  { id: "p2", name: "Website Refresh", domain: "work", tasksTotal: 20, tasksDone: 7, dueLabel: "Due Oct 1" },
  { id: "p3", name: "Home Office Setup", domain: "personal", tasksTotal: 6, tasksDone: 5 },
  { id: "p4", name: "Family Holiday", domain: "family", tasksTotal: 9, tasksDone: 3, dueLabel: "Due Dec" },
];

const TASKS: ProjectTask[] = [
  { id: "pt1", title: "Draft executive summary", project: "Q3 Strategy", domain: "work", priority: "high", done: false },
  { id: "pt2", title: "Competitor analysis slide", project: "Q3 Strategy", domain: "work", priority: "high", done: false },
  { id: "pt3", title: "Review homepage copy", project: "Website Refresh", domain: "work", priority: "medium", done: false },
  { id: "pt4", title: "Order standing desk", project: "Home Office Setup", domain: "personal", priority: "medium", done: true },
  { id: "pt5", title: "Research flights to Lisbon", project: "Family Holiday", domain: "family", priority: "low", done: false },
];

const WEEKLY_DATA: BarDatum[] = [
  { day: "M", value: 5 },
  { day: "T", value: 8 },
  { day: "W", value: 4 },
  { day: "T", value: 9 },
  { day: "F", value: 6, isToday: true },
  { day: "S", value: 0 },
  { day: "S", value: 0 },
];

const DOMAIN_META = {
  work:     { label: "Work",     color: Colors.domainWork },
  personal: { label: "Personal", color: Colors.domainPersonal },
  family:   { label: "Family",   color: Colors.domainFamily },
};

const PRIORITY_COLOR = {
  high:   Colors.primary,
  medium: Colors.domainFamily,
  low:    Colors.textTertiary,
};

// ---------------------------------------------------------------------------
// ProjectCard
// ---------------------------------------------------------------------------

function ProjectCard({ project }: { project: Project }) {
  const meta = DOMAIN_META[project.domain];
  const pct = project.tasksDone / project.tasksTotal;

  return (
    <View style={styles.projectCard}>
      <View style={styles.projectCardTop}>
        <View style={[styles.projectDomainPip, { backgroundColor: meta.color }]} />
        <View style={styles.projectCardInfo}>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.projectMeta}>
            {meta.label}{project.dueLabel ? `  ·  ${project.dueLabel}` : ""}
          </Text>
        </View>
        <Text style={styles.projectRatio}>
          {project.tasksDone}/{project.tasksTotal}
        </Text>
      </View>
      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { flex: pct, backgroundColor: meta.color }]} />
        <View style={{ flex: 1 - pct }} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// TaskListItem
// ---------------------------------------------------------------------------

function TaskListItem({ task, onToggle }: { task: ProjectTask; onToggle: (id: string) => void }) {
  const meta = DOMAIN_META[task.domain];
  return (
    <Pressable
      id={`project-task-${task.id}`}
      style={[styles.taskItem, task.done && styles.taskItemDone]}
      onPress={() => onToggle(task.id)}
      android_ripple={{ color: Colors.borderLight }}
    >
      <View
        style={[
          styles.priorityBar,
          { backgroundColor: PRIORITY_COLOR[task.priority] },
        ]}
      />
      <View style={styles.taskItemContent}>
        <Text
          style={[styles.taskItemTitle, task.done && styles.taskItemTitleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <Text style={styles.taskItemProject}>{task.project}</Text>
      </View>
      <View style={[styles.taskDomainDot, { backgroundColor: meta.color }]} />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function ProjectsScreen() {
  const [activeDomain, setActiveDomain] = useState<Domain>("all");
  const [tasks, setTasks] = useState<ProjectTask[]>(TASKS);

  const domains: { key: Domain; label: string }[] = [
    { key: "all", label: "All" },
    { key: "work", label: "Work" },
    { key: "personal", label: "Personal" },
    { key: "family", label: "Family" },
  ];

  const filteredProjects = PROJECTS.filter(
    (p) => activeDomain === "all" || p.domain === activeDomain
  );
  const filteredTasks = tasks.filter(
    (t) => activeDomain === "all" || t.domain === activeDomain
  );

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Projects</Text>
          <TouchableOpacity
            id="projects-add"
            style={styles.addButton}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add" size={22} color={Colors.textOnDark} />
          </TouchableOpacity>
        </View>

        {/* ── Domain filter pills ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {domains.map((d) => {
            const active = activeDomain === d.key;
            return (
              <TouchableOpacity
                key={d.key}
                id={`projects-filter-${d.key}`}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setActiveDomain(d.key)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Weekly chart ── */}
        <View style={styles.chartCard}>
          <View style={styles.chartRow}>
            <View>
              <Text style={styles.chartBigNum}>{doneTasks}</Text>
              <Text style={styles.chartCaption}>tasks done this week</Text>
            </View>
            <View style={styles.chartRight}>
              <WeeklyBarChart
                data={WEEKLY_DATA}
                height={60}
                fillColor={Colors.chartFill}
              />
            </View>
          </View>
        </View>

        {/* ── Projects ── */}
        <Text style={styles.sectionLabel}>ACTIVE PROJECTS</Text>
        {filteredProjects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}

        {filteredProjects.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={36} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No projects in this domain yet</Text>
          </View>
        )}

        {/* ── Task list ── */}
        <Text style={styles.sectionLabel}>OPEN TASKS</Text>
        <View style={styles.taskList}>
          {filteredTasks.map((task, idx) => (
            <React.Fragment key={task.id}>
              <TaskListItem task={task} onToggle={toggleTask} />
              {idx < filteredTasks.length - 1 && (
                <View style={styles.taskListDivider} />
              )}
            </React.Fragment>
          ))}
          {filteredTasks.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>All tasks complete</Text>
            </View>
          )}
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    ...TextStyles.h2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.sm,
  },

  // Filters
  filtersRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  filterPill: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 36,
    justifyContent: "center",
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  filterLabelActive: {
    color: Colors.textOnDark,
  },

  // Chart card
  chartCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.base,
  },
  chartBigNum: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xxxl,
    color: Colors.textOnDark,
    lineHeight: FontSize.xxxl * 1.1,
  },
  chartCaption: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    opacity: 0.7,
    marginTop: 2,
  },
  chartRight: {
    flex: 1,
  },

  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 2,
    marginTop: Spacing.sm,
  },

  // Project cards
  projectCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadows.xs,
  },
  projectCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  projectDomainPip: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  projectCardInfo: {
    flex: 1,
    gap: 2,
  },
  projectName: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  projectMeta: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  projectRatio: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  progressTrack: {
    height: 5,
    borderRadius: Radius.pill,
    backgroundColor: Colors.chartTrack,
    flexDirection: "row",
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: Radius.pill,
  },

  // Task list
  taskList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.xs,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 56,
    gap: Spacing.md,
  },
  taskItemDone: {
    opacity: 0.45,
  },
  priorityBar: {
    width: 3,
    height: 28,
    borderRadius: Radius.pill,
    flexShrink: 0,
  },
  taskItemContent: {
    flex: 1,
    gap: 3,
  },
  taskItemTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  taskItemTitleDone: {
    textDecorationLine: "line-through",
    color: Colors.textTertiary,
  },
  taskItemProject: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  taskDomainDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  taskListDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.base + 3 + Spacing.md,
  },

  emptyState: {
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.sm,
  },
  emptyText: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: "center",
  },
});
