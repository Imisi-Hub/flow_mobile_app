import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/src/constants/theme";

// ─── Auth Stack Layout ────────────────────────────────────────────────────────
// Wraps the sign-in and sign-up screens.
// No header shown — each screen manages its own visual header.

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
