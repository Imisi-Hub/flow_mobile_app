import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View, Text } from "react-native";
import { Colors, FontFamily, FontSize, Radius, Shadows } from "@/src/constants/theme";

// ─── Tab Icons (inline SVG-style using React Native shapes) ──────────────────
// Using @expo/vector-icons (bundled with Expo) for iconography.
// Replace with custom SVG icons in the UI polish pass.

import { Ionicons } from "@expo/vector-icons";

type TabIconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  focused: boolean;
  label: string;
};

function TabIcon({ name, focused, label }: TabIconProps) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? Colors.primary : Colors.textTertiary}
      />
      <Text
        style={[
          styles.tabLabel,
          focused ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

// ─── Bottom Tab Layout ────────────────────────────────────────────────────────

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // We render labels inside the icon component
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "grid" : "grid-outline"}
              focused={focused}
              label="Dashboard"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "folder" : "folder-outline"}
              focused={focused}
              label="Projects"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "bar-chart" : "bar-chart-outline"}
              focused={focused}
              label="Insights"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: "Focus",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "timer" : "timer-outline"}
              focused={focused}
              label="Focus"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    height: Platform.OS === "ios" ? 84 : 64,
    paddingBottom: Platform.OS === "ios" ? 20 : 4,
    paddingTop: 8,
    ...Shadows.md,
    // Soft top shadow instead of a hard border line
    shadowOffset: { width: 0, height: -4 },
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radius.lg,
    minWidth: 56,
  },
  iconWrapperActive: {
    backgroundColor: Colors.primaryMuted,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
  },
  tabLabelInactive: {
    fontFamily: FontFamily.bodyRegular,
    color: Colors.textTertiary,
  },
});
