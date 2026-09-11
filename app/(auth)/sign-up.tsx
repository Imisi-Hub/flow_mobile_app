/**
 * sign-up.tsx
 *
 * Layout family: EDITORIAL BRAND + FORM CARD (parallel to sign-in)
 * Warm-cream background, same terracotta brand mark as sign-in.
 * Three-field form (email, password, confirm password) with show/hide toggle.
 * Password strength indicator as a progress bar (data-viz, not color emoji).
 * Primary CTA: tall, confident terracotta button.
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
import { signUpWithEmail } from "@/src/lib/supabase";

// ---------------------------------------------------------------------------
// Password strength (data-viz bar, no emoji)
// ---------------------------------------------------------------------------

function getPasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0..5
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
const STRENGTH_COLORS = [
  Colors.chartGrid,
  Colors.error,
  Colors.warning,
  Colors.domainFamily,
  Colors.sage,
  Colors.success,
];

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (!password) return null;
  const color = STRENGTH_COLORS[strength];
  const label = STRENGTH_LABELS[strength];
  return (
    <View style={strengthStyles.container}>
      <View style={strengthStyles.trackRow}>
        {[1, 2, 3, 4, 5].map((seg) => (
          <View
            key={seg}
            style={[
              strengthStyles.segment,
              { backgroundColor: seg <= strength ? color : Colors.chartGrid },
            ]}
          />
        ))}
      </View>
      <Text style={[strengthStyles.label, { color }]}>{label}</Text>
    </View>
  );
}

const strengthStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  trackRow: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.xxs,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: Radius.pill,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    width: 64,
    textAlign: "right",
  },
});

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRef = useRef<TextInputType>(null);
  const confirmRef = useRef<TextInputType>(null);

  async function handleSignUp() {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    try {
      setIsLoading(true);
      await signUpWithEmail(email.trim(), password);
      Alert.alert(
        "Check your email",
        "We've sent a confirmation link to " + email.trim() + ". Verify your email to sign in.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/sign-in") }]
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sign up failed. Please try again.";
      Alert.alert("Sign Up Failed", message);
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
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>F</Text>
          </View>
          <Text style={styles.appName}>Flow</Text>
          <Text style={styles.tagline}>Begin your journey to deep work</Text>
        </View>

        {/* ── Form card ── */}
        <View style={styles.card}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>Create account</Text>
            <Text style={styles.cardSubtitle}>Your productivity sanctuary awaits</Text>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <TextInput
              id="sign-up-email"
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

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                id="sign-up-password"
                ref={passwordRef}
                style={[styles.input, styles.inputWithAction]}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 8 characters"
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
              <TouchableOpacity
                id="sign-up-toggle-password"
                style={styles.inputAction}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.inputActionText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            <PasswordStrengthBar password={password} />
          </View>

          {/* Confirm password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CONFIRM PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                id="sign-up-confirm-password"
                ref={confirmRef}
                style={[
                  styles.input,
                  styles.inputWithAction,
                  confirmPassword && confirmPassword !== password
                    ? styles.inputError
                    : null,
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry={!showConfirm}
                autoComplete="new-password"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              <TouchableOpacity
                id="sign-up-toggle-confirm"
                style={styles.inputAction}
                onPress={() => setShowConfirm((v) => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.inputActionText}>
                  {showConfirm ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary CTA */}
          <TouchableOpacity
            id="sign-up-button"
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.88}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textOnDark} />
            ) : (
              <Text style={styles.primaryButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Terms note */}
          <Text style={styles.termsNote}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?  </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity id="go-to-sign-in">
              <Text style={styles.footerLink}>Sign in</Text>
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
  inputError: {
    borderColor: Colors.error + "80",
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

  termsNote: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: FontSize.xs * 1.6,
    marginTop: -Spacing.xs,
  },

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
