import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/theme";
import { initializeDatabase } from "@/src/lib/sqlite";
import { useEffect } from "react";

// ─── TanStack Query Client ────────────────────────────────────────────────────
//
// Configured for offline-first operation:
//   - staleTime: 5 min (don't refetch fresh data)
//   - gcTime: 24 h (keep cached data in memory for a full day)
//   - retry: 3 attempts on failure
//   - refetchOnReconnect: true (auto-sync when network returns)
//
// TODO: Add @tanstack/react-query-persist-client with AsyncStorage in the
//       database-layer feature pass for persistent cache across app restarts.

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 minutes
      gcTime: 1000 * 60 * 60 * 24,    // 24 hours
      retry: 3,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,     // not relevant for mobile
    },
    mutations: {
      retry: 1,
    },
  },
});

// ─── NetInfo → onlineManager bridge ─────────────────────────────────────────
// When the device reconnects, TanStack Query automatically refetches
// all stale queries. This is the "plumbing" for offline support.

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected && !!state.isInternetReachable);
  });
});

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // Initialize local SQLite database on first mount
  useEffect(() => {
    initializeDatabase().catch((err) => {
      console.error("[RootLayout] SQLite init failed:", err);
    });
  }, []);

  // Hold rendering until fonts are ready to prevent font flash
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              title: "Settings",
              headerStyle: { backgroundColor: Colors.background },
              headerTintColor: Colors.textPrimary,
              presentation: "modal",
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});
