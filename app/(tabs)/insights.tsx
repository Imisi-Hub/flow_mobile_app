/**
 * insights.tsx
 *
 * Layout family: DATA-VISUALIZATION FIRST
 * Structurally distinct from Dashboard (no task rows) and Projects (no kanban).
 * Layout: archetype card (editorial), efficiency ring (data viz),
 * weekly rhythm bar chart, streak heatmap (Streaks-style calendar),
 * health garden (hydration/movement), achievements (bold numeric milestones,
 * no badges), social leaderboard teaser.
 *
 * All gamification expressed through data visualization:
 * - Streak: bold number + heatmap calendar
 * - XP: numeric count + thin progress bar
 * - Achievements: typographic milestone markers
 * - Efficiency: circular progress ring
 * No cartoon badges, no emoji as primary iconography, no confetti.
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { StreakHeatmap, HeatmapCell } from "@/src/components/StreakHeatmap";
import { ProgressRing } from "@/src/components/ProgressRing";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const WEEKLY_DATA: BarDatum[] = [
  { day: "M", value: 90 },
  { day: "T", value: 120 },
  { day: "W", value: 45 },
  { day: "T", value: 150 },
  { day: "F", value: 80, isToday: true },
  { day: "S", value: 0 },
  { day: "S", value: 0 },
];

// 5 weeks x 7 days heatmap
function buildHeatmap(): HeatmapCell[][] {
  const today = new Date();
  const weeks: HeatmapCell[][] = [];
  // go back 4 full weeks + current partial week
  for (let w = 4; w >= 0; w--) {
    const week: HeatmapCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toISOString().slice(0, 10);
      const isFuture = date > today;
      const isToday = dateStr === today.toISOString().slice(0, 10);
      week.push({
        date: dateStr,
        value: isFuture ? 0 : isToday ? 2 : Math.floor(Math.random() * 4),
        isToday,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

const HEATMAP_DATA = buildHeatmap();

const ACHIEVEMENTS = [
  { id: "a1", label: "First Flow", milestone: "1 focus session", unlocked: true },
  { id: "a2", label: "Week of Wins", milestone: "7-day streak", unlocked: true },
  { id: "a3", label: "Deep Worker", milestone: "10 hours focused", unlocked: false },
  { id: "a4", label: "Centurion", milestone: "100 tasks done", unlocked: false },
];

const LEADERBOARD = [
  { rank: 1, initials: "SR", name: "Sarah R.", xp: 3420, isYou: false },
  { rank: 2, initials: "JM", name: "James M.", xp: 2890, isYou: false },
  { rank: 3, initials: "YO", name: "You", xp: 2640, isYou: true },
  { rank: 4, initials: "PK", name: "Priya K.", xp: 2210, isYou: false },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function InitialsAvatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Radius.full,
        backgroundColor: color + "22",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: color + "44",
      }}
    >
      <Text
        style={{
          fontFamily: FontFamily.headingBold,
          fontSize: size * 0.36,
          color,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
          <Text style={styles.headerSubtitle}>Your productivity pattern</Text>
        </View>

        {/* ── Archetype card (editorial, warm paper feel) ── */}
        <View style={styles.archetypeCard}>
          <View style={styles.archetypeLeft}>
            <Text style={styles.archetypeOverline}>YOUR ARCHETYPE</Text>
            <Text style={styles.archetypeName}>The Focused Strategist</Text>
            <Text style={styles.archetypeDesc}>
              You do your best work in long blocks before noon. Q2 tasks are your
              blind spot -- try scheduling one daily.
            </Text>
          </View>
          <View style={styles.archetypeRingWrap}>
            <ProgressRing
              size={80}
              strokeWidth={8}
              progress={0.72}
              fillColor={Colors.primary}
              centerLabel="72%"
              centerSublabel="fit"
              centerLabelSize={FontSize.md}
            />
          </View>
        </View>

        {/* ── Efficiency ring + stats row ── */}
        <View style={styles.efficiencyRow}>
          <View style={styles.efficiencyRingCard}>
            <Text style={styles.efficiencyLabel}>Focus efficiency</Text>
            <ProgressRing
              size={100}
              strokeWidth={10}
              progress={0.68}
              fillColor={Colors.sage}
              trackColor={Colors.sageMuted}
              centerLabel="68%"
              centerSublabel="this week"
              centerLabelSize={FontSize.lg}
            />
          </View>
          <View style={styles.efficiencyStats}>
            <View style={styles.efficiencyStat}>
              <Text style={styles.efficiencyStatValue}>7</Text>
              <Text style={styles.efficiencyStatLabel}>day streak</Text>
              <View style={styles.efficiencyStatBar}>
                <View style={[styles.efficiencyStatFill, { flex: 7/14, backgroundColor: Colors.primary }]} />
                <View style={{ flex: 7/14 }} />
              </View>
            </View>
            <View style={styles.efficiencyStat}>
              <Text style={styles.efficiencyStatValue}>2640</Text>
              <Text style={styles.efficiencyStatLabel}>XP total</Text>
              <View style={styles.efficiencyStatBar}>
                <View style={[styles.efficiencyStatFill, { flex: 2640/5000, backgroundColor: Colors.warning }]} />
                <View style={{ flex: (5000-2640)/5000 }} />
              </View>
            </View>
            <View style={styles.efficiencyStat}>
              <Text style={styles.efficiencyStatValue}>32</Text>
              <Text style={styles.efficiencyStatLabel}>tasks/week avg</Text>
              <View style={styles.efficiencyStatBar}>
                <View style={[styles.efficiencyStatFill, { flex: 32/50, backgroundColor: Colors.sage }]} />
                <View style={{ flex: 18/50 }} />
              </View>
            </View>
          </View>
        </View>

        {/* ── Weekly rhythm chart ── */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly rhythm</Text>
          <Text style={styles.chartSubtitle}>focus minutes per day</Text>
          <WeeklyBarChart
            data={WEEKLY_DATA}
            height={80}
            fillColor={Colors.chartFill}
            showValues
          />
        </View>

        {/* ── Streak heatmap (Streaks-style calendar) ── */}
        <View style={styles.heatmapCard}>
          <View style={styles.heatmapHeader}>
            <Text style={styles.chartTitle}>Activity</Text>
            <View style={styles.heatmapLegend}>
              <Text style={styles.legendLabel}>Less</Text>
              {[0, 1, 2, 3, 4].map((v) => (
                <View
                  key={v}
                  style={[
                    styles.legendCell,
                    {
                      backgroundColor: v === 0
                        ? Colors.chartGrid
                        : Colors.chartFill + ["08", "30", "60", "90", "FF"][v],
                    },
                  ]}
                />
              ))}
              <Text style={styles.legendLabel}>More</Text>
            </View>
          </View>
          <StreakHeatmap
            weeks={HEATMAP_DATA}
            fillColor={Colors.chartFill}
          />
        </View>

        {/* ── Health garden (hydration + movement) ── */}
        <View style={styles.gardenCard}>
          <View style={styles.gardenHeader}>
            <Ionicons name="leaf-outline" size={18} color={Colors.sage} />
            <Text style={styles.gardenTitle}>Health Garden</Text>
          </View>
          <View style={styles.gardenRow}>
            {/* Hydration */}
            <View style={styles.gardenItem}>
              <Ionicons name="water-outline" size={20} color={Colors.info} />
              <Text style={styles.gardenValue}>2/8</Text>
              <Text style={styles.gardenItemLabel}>glasses</Text>
              <View style={styles.gardenTrack}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.gardenSegment,
                      { backgroundColor: i < 2 ? Colors.info : Colors.chartGrid },
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.gardenDivider} />
            {/* Movement */}
            <View style={styles.gardenItem}>
              <Ionicons name="walk-outline" size={20} color={Colors.sage} />
              <Text style={styles.gardenValue}>4,230</Text>
              <Text style={styles.gardenItemLabel}>steps</Text>
              <View style={styles.gardenTrack}>
                <View style={[styles.gardenProgressFill, { flex: 4230 / 10000, backgroundColor: Colors.sage }]} />
                <View style={{ flex: (10000 - 4230) / 10000 }} />
              </View>
            </View>
          </View>
        </View>

        {/* ── Achievements (typographic milestones, no badges) ── */}
        <Text style={styles.sectionLabel}>MILESTONES</Text>
        <View style={styles.achievementsGrid}>
          {ACHIEVEMENTS.map((a) => (
            <View
              key={a.id}
              style={[
                styles.achievementCard,
                !a.unlocked && styles.achievementCardLocked,
              ]}
            >
              {a.unlocked ? (
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              ) : (
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textTertiary} />
              )}
              <Text
                style={[
                  styles.achievementLabel,
                  !a.unlocked && styles.achievementLabelLocked,
                ]}
              >
                {a.label}
              </Text>
              <Text style={styles.achievementMilestone}>{a.milestone}</Text>
            </View>
          ))}
        </View>

        {/* ── Social leaderboard teaser ── */}
        <Text style={styles.sectionLabel}>LEADERBOARD</Text>
        <View style={styles.leaderboardCard}>
          {LEADERBOARD.map((entry) => (
            <View
              key={entry.rank}
              style={[
                styles.leaderRow,
                entry.isYou && styles.leaderRowYou,
              ]}
            >
              <Text style={[styles.leaderRank, entry.rank === 1 && styles.leaderRankFirst]}>
                {entry.rank}
              </Text>
              <InitialsAvatar
                initials={entry.initials}
                color={entry.isYou ? Colors.primary : Colors.sage}
                size={34}
              />
              <Text style={[styles.leaderName, entry.isYou && styles.leaderNameYou]}>
                {entry.name}
              </Text>
              <Text style={styles.leaderXP}>{entry.xp.toLocaleString()} XP</Text>
            </View>
          ))}
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
    gap: 2,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    ...TextStyles.h2,
  },
  headerSubtitle: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },

  // Archetype card
  archetypeCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
    ...Shadows.md,
  },
  archetypeLeft: {
    flex: 1,
    gap: Spacing.sm,
  },
  archetypeOverline: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    opacity: 0.65,
    letterSpacing: 1.5,
  },
  archetypeName: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.lg,
    color: Colors.textOnDark,
    lineHeight: FontSize.lg * 1.2,
  },
  archetypeDesc: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textOnDark,
    opacity: 0.75,
    lineHeight: FontSize.xs * 1.6,
  },
  archetypeRingWrap: {
    opacity: 0.9,
  },

  // Efficiency row
  efficiencyRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  efficiencyRingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.xs,
    flex: 0,
    minWidth: 120,
  },
  efficiencyLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  efficiencyStats: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadows.xs,
  },
  efficiencyStat: {
    gap: 3,
  },
  efficiencyStatValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  efficiencyStatLabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  efficiencyStatBar: {
    height: 3,
    borderRadius: Radius.pill,
    backgroundColor: Colors.chartTrack,
    flexDirection: "row",
    overflow: "hidden",
  },
  efficiencyStatFill: {
    borderRadius: Radius.pill,
  },

  // Charts
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadows.xs,
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

  // Heatmap
  heatmapCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadows.xs,
  },
  heatmapHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heatmapLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  legendLabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: 9,
    color: Colors.textTertiary,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },

  // Garden
  gardenCard: {
    backgroundColor: Colors.sageMuted,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadows.xs,
  },
  gardenHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  gardenTitle: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.md,
    color: Colors.sageDark,
  },
  gardenRow: {
    flexDirection: "row",
    gap: Spacing.base,
  },
  gardenItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  gardenValue: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  gardenItemLabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  gardenTrack: {
    width: "100%",
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.chartGrid,
    flexDirection: "row",
    gap: 2,
    overflow: "hidden",
  },
  gardenSegment: {
    flex: 1,
    borderRadius: Radius.pill,
  },
  gardenProgressFill: {
    borderRadius: Radius.pill,
  },
  gardenDivider: {
    width: 1,
    backgroundColor: Colors.sage + "44",
    marginVertical: Spacing.sm,
  },

  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 2,
    marginTop: Spacing.sm,
  },

  // Achievements
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  achievementCard: {
    flex: 1,
    minWidth: "44%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.xs,
    ...Shadows.xs,
  },
  achievementCardLocked: {
    opacity: 0.45,
  },
  achievementLabel: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  achievementLabelLocked: {
    color: Colors.textTertiary,
  },
  achievementMilestone: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },

  // Leaderboard
  leaderboardCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.xs,
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  leaderRowYou: {
    backgroundColor: Colors.primaryMuted,
  },
  leaderRank: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.lg,
    color: Colors.textTertiary,
    width: 24,
    textAlign: "center",
  },
  leaderRankFirst: {
    color: Colors.warning,
  },
  leaderName: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  leaderNameYou: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
  },
  leaderXP: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
