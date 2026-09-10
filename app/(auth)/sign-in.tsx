/**
 * sign-in.tsx
 *
 * Layout family: EDITORIAL BRAND + FORM CARD
 * Warm-cream background, terracotta brand mark with the "F" wordmark.
 * Form card on warm white surface with generous internal padding.
 * Primary CTA: tall, confident terracotta button (min 56pt).
 * No emoji, no cartoon illustration -- brand identity through typography alone.
 */
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput as TextInputType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
  Radius,
  Shadows,
  TextStyles,
} from "@/src/constants/theme";
import { signInWithEmail } from "@/src/lib/supabase";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInputType>(null);

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmail(email.trim(), password);
      router.replace("/(tabs)/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      Alert.alert("Sign In Failed", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Brand ── */}
        <View style={styles.brand}>
          {/* Wordmark circle */}
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>F</Text>
          </View>
          <Text style={styles.appName}>Flow</Text>
          <Text style={styles.tagline}>Your tactile sanctuary for deep work</Text>
        </View>

        {/* ── Form card ── */}
        <View style={styles.card}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSubtitle}>Continue where you left off</Text>
          </View>

          {/* Email field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <TextInput
              id="sign-in-email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          {/* Password field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                id="sign-in-password"
                ref={passwordRef}
                style={[styles.input, styles.inputWithAction]}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 8 characters"
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry={!showPassword}
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
              <TouchableOpacity
                id="sign-in-toggle-password"
                style={styles.inputAction}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.inputActionText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity
            id="sign-in-forgot"
            style={styles.forgotRow}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Primary CTA */}
          <TouchableOpacity
            id="sign-in-button"
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.88}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textOnDark} />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?  </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity id="go-to-sign-up">
              <Text style={styles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.page,
    gap: Spacing.xxl,
  },

  // Brand
  brand: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
  },
  logoLetter: {
    fontFamily: FontFamily.headingBold,
    fontSize: 40,
    color: Colors.textOnDark,
    letterSpacing: -1,
  },
  appName: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xxxl,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: FontSize.sm * 1.5,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.base,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardHeading: {
    gap: 4,
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    ...TextStyles.h3,
  },
  cardSubtitle: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },

  // Form
  fieldGroup: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
  },
  input: {
    height: 52,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  inputWrapper: {
    position: "relative",
  },
  inputWithAction: {
    paddingRight: 60,
  },
  inputAction: {
    position: "absolute",
    right: Spacing.base,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  inputActionText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },

  forgotRow: {
    alignSelf: "flex-end",
    marginTop: -Spacing.xs,
  },
  forgotText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },

  // Buttons
  primaryButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xs,
    ...Shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.base,
    color: Colors.textOnDark,
    letterSpacing: 0.5,
  },

  // Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
});
