import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
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

// ─── Settings Screen ──────────────────────────────────────────────────────────
// Presented as a modal from the Dashboard header.
// Full implementation (profile editing, notification prefs, biometric toggle,
// theme, data export, account deletion) in the feature/settings pass.

type SettingsRow = {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  sublabel?: string;
  color?: string;
  onPress: () => void;
};

export default function SettingsScreen() {
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
          onPress: () => {},
        },
        {
          id: "domains",
          icon: "layers-outline",
          label: "Domains",
          sublabel: "Work · Personal · Family",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Security",
      rows: [
        {
          id: "biometrics",
          icon: "finger-print-outline",
          label: "Biometric Lock",
          sublabel: "Lock vault with Face ID / Touch ID",
          onPress: () => {},
        },
        {
          id: "change-password",
          icon: "key-outline",
          label: "Change Password",
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
          label: "Notification Preferences",
          sublabel: "Focus reminders, streaks, nudges",
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
          label: "Export My Data",
          sublabel: "Download all tasks and sessions",
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
          color: Colors.error,
          onPress: handleSignOut,
        },
        {
          id: "delete-account",
          icon: "trash-outline",
          label: "Delete Account",
          sublabel: "Permanently delete all your data",
          color: Colors.error,
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User card placeholder ── */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color={Colors.textOnDark} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Your Name</Text>
            <Text style={styles.userEmail}>your@email.com</Text>
          </View>
        </View>

        {/* ── Settings sections ── */}
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.rows.map((row, idx) => (
                <TouchableOpacity
                  key={row.id}
                  id={`settings-${row.id}`}
                  style={[
                    styles.row,
                    idx < section.rows.length - 1 && styles.rowBorder,
                  ]}
                  onPress={row.onPress}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.rowIconWrap,
                      {
                        backgroundColor: row.color
                          ? row.color + "18"
                          : Colors.backgroundSecondary,
                      },
                    ]}
                  >
                    <Ionicons
                      name={row.icon}
                      size={20}
                      color={row.color ?? Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.rowContent}>
                    <Text
                      style={[
                        styles.rowLabel,
                        row.color && { color: row.color },
                      ]}
                    >
                      {row.label}
                    </Text>
                    {row.sublabel ? (
                      <Text style={styles.rowSublabel}>{row.sublabel}</Text>
                    ) : null}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.textTertiary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.versionText}>Flow v1.0.0 · Scaffold build</Text>
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

  // User card
  userCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
    ...Shadows.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  userName: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.lg,
    color: Colors.textOnDark,
  },
  userEmail: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textOnDark,
    opacity: 0.75,
  },

  // Sections
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 2,
    paddingLeft: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadows.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.base,
    gap: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
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
  rowSublabel: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  versionText: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
