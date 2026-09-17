/**
 * settings.tsx
 *
 * Layout family: EDITORIAL LIST WITH GENEROUS RHYTHM
 * Structurally distinct: no charts, no task rows, no timer.
 * Layout: warm profile card (typographic, initials avatar, no photo required),
 * grouped settings sections with generous vertical spacing (Things 3 style),
 * theme switcher row with color swatch previews, version footer.
 *
 * Profile card uses initials avatar -- no photo required.
 * Touch targets: min 52pt height per row.
 * No emoji -- Ionicons throughout.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  Radius,
  Shadows,
  TextStyles,
} from "@/src/constants/theme";
import { signOut } from "@/src/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SettingsRow = {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  sublabel?: string;
  color?: string;
  trailing?: "chevron" | "switch" | "value";
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  valueText?: string;
  onPress?: () => void;
  destructive?: boolean;
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SettingsSection({
  title,
  rows,
}: {
  title: string;
  rows: SettingsRow[];
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {rows.map((row, idx) => (
          <React.Fragment key={row.id}>
            <SettingsRowItem row={row} />
            {idx < rows.length - 1 && <View style={styles.rowDivider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

function SettingsRowItem({ row }: { row: SettingsRow }) {
  const iconBg = row.destructive
    ? Colors.error + "18"
    : row.color
    ? row.color + "18"
    : Colors.backgroundSecondary;

  const iconColor = row.destructive
    ? Colors.error
    : row.color ?? Colors.textSecondary;

  return (
    <TouchableOpacity
      id={`settings-${row.id}`}
      style={styles.row}
      onPress={row.onPress}
      activeOpacity={row.trailing === "switch" ? 1 : 0.7}
      disabled={!row.onPress && row.trailing !== "switch"}
    >
      <View style={[styles.rowIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={row.icon} size={20} color={iconColor} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, row.destructive && styles.rowLabelDestructive]}>
          {row.label}
        </Text>
        {row.sublabel ? (
          <Text style={styles.rowSublabel}>{row.sublabel}</Text>
        ) : null}
      </View>
      {row.trailing === "chevron" && (
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      )}
      {row.trailing === "switch" && row.onSwitchChange !== undefined && (
        <Switch
          value={row.switchValue}
          onValueChange={row.onSwitchChange}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={Colors.surface}
        />
      )}
      {row.trailing === "value" && row.valueText ? (
        <Text style={styles.rowValueText}>{row.valueText}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [dailySpark, setDailySpark] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/sign-in");
          } catch {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  }

  const sections: { title: string; rows: SettingsRow[] }[] = [
    {
      title: "Account",
      rows: [
        {
          id: "profile",
          icon: "person-circle-outline",
          label: "Profile",
          sublabel: "Name, avatar, email",
          trailing: "chevron",
          onPress: () => {},
        },
        {
          id: "domains",
          icon: "layers-outline",
          label: "Domains",
          sublabel: "Work, Personal, Family",
          trailing: "chevron",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Focus",
      rows: [
        {
          id: "default-duration",
          icon: "timer-outline",
          label: "Default session length",
          trailing: "value",
          valueText: "25 min",
          onPress: () => {},
        },
        {
          id: "break-reminder",
          icon: "cafe-outline",
          label: "Break reminders",
          trailing: "value",
          valueText: "Every 2 sessions",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Notifications",
      rows: [
        {
          id: "notifications",
          icon: "notifications-outline",
          label: "Focus reminders",
          sublabel: "Nudges and streak alerts",
          trailing: "switch",
          switchValue: notifications,
          onSwitchChange: setNotifications,
        },
        {
          id: "daily-spark",
          icon: "sunny-outline",
          label: "Daily Spark",
          sublabel: "Morning intention prompt",
          trailing: "switch",
          switchValue: dailySpark,
          onSwitchChange: setDailySpark,
        },
      ],
    },
    {
      title: "Security",
      rows: [
        {
          id: "biometrics",
          icon: "finger-print-outline",
          label: "Biometric lock",
          sublabel: "Face ID or Touch ID",
          trailing: "switch",
          switchValue: biometrics,
          onSwitchChange: setBiometrics,
        },
        {
          id: "change-password",
          icon: "key-outline",
          label: "Change password",
          trailing: "chevron",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Data",
      rows: [
        {
          id: "export",
          icon: "download-outline",
          label: "Export my data",
          sublabel: "Download all tasks and sessions",
          trailing: "chevron",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Danger Zone",
      rows: [
        {
          id: "sign-out",
          icon: "log-out-outline",
          label: "Sign Out",
          destructive: true,
          trailing: "chevron",
          onPress: handleSignOut,
        },
        {
          id: "delete-account",
          icon: "trash-outline",
          label: "Delete Account",
          sublabel: "Permanently delete all your data",
          destructive: true,
          trailing: "chevron",
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile card -- warm, editorial ── */}
        <View style={styles.profileCard}>
          {/* Initials avatar */}
          <View style={styles.profileAvatarWrap}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarInitials}>A</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Your Name</Text>
            <Text style={styles.profileEmail}>your@email.com</Text>
            <View style={styles.profileXpRow}>
              <Ionicons name="star" size={12} color={Colors.warning} />
              <Text style={styles.profileXp}>2,640 XP</Text>
              <View style={styles.profileXpDivider} />
              <Ionicons name="flame" size={12} color={Colors.primary} />
              <Text style={styles.profileStreak}>7-day streak</Text>
            </View>
          </View>
          <TouchableOpacity
            id="settings-edit-profile"
            style={styles.profileEditButton}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil-outline" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Sections ── */}
        {sections.map((section) => (
          <SettingsSection
            key={section.title}
            title={section.title}
            rows={section.rows}
          />
        ))}

        {/* ── Version footer ── */}
        <Text style={styles.versionText}>Flow v1.0.0</Text>
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
    gap: Spacing.lg,
  },

  // Profile card
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  profileAvatarWrap: {
    position: "relative",
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.primaryMuted,
  },
  profileAvatarInitials: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xl,
    color: Colors.textOnDark,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  profileXpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 4,
  },
  profileXp: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  profileXpDivider: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
  },
  profileStreak: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  profileEditButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },

  // Sections
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    paddingLeft: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.xs,
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 52,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.base + 38 + Spacing.md,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  rowLabelDestructive: {
    color: Colors.error,
  },
  rowSublabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  rowValueText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },

  // Version
  versionText: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
