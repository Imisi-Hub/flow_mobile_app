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

// ─── Projects Screen ──────────────────────────────────────────────────────────
// Placeholder for the Projects feature.
// Full implementation (domain cards, project list, task counts, drag-to-prioritize)
// will be built in the feature/projects pass.

export default function ProjectsScreen() {
  const domains = [
    { id: "work", label: "Work", color: Colors.domainWork, icon: "briefcase-outline" as const },
    { id: "personal", label: "Personal", color: Colors.domainPersonal, icon: "person-outline" as const },
    { id: "family", label: "Family", color: Colors.domainFamily, icon: "people-outline" as const },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Projects</Text>
          <Text style={styles.headerSubtitle}>Your domains of focus</Text>
        </View>

        {/* ── Domain pills ── */}
        <View style={styles.domainsRow}>
          {domains.map((d) => (
            <View
              key={d.id}
              style={[styles.domainPill, { backgroundColor: d.color + "22" }]}
            >
              <Ionicons name={d.icon} size={16} color={d.color} />
              <Text style={[styles.domainPillLabel, { color: d.color }]}>
                {d.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Empty state ── */}
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="folder-open-outline" size={40} color={Colors.sage} />
          </View>
          <Text style={styles.emptyTitle}>No projects yet</Text>
          <Text style={styles.emptyBody}>
            Your projects and tasks across Work, Personal, and Family domains
            will appear here. Full project management is coming soon.
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
  domainsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  domainPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  domainPillLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.sageMuted,
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
