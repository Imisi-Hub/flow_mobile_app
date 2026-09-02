// ─── Flow Design Tokens ──────────────────────────────────────────────────────
// "The Tactile Sanctuary" — warm, grounded, and alive.
// Inspired by natural materials: terracotta, cream linen, sage, aged wood.

// ─── Colors ──────────────────────────────────────────────────────────────────

export const Colors = {
  // Primary — warm burnt-orange / terracotta
  primary: "#C0603C",
  primaryLight: "#D4855E",
  primaryDark: "#9A4A2C",
  primaryMuted: "#F0D9CE", // very light terracotta tint for backgrounds

  // Background — warm cream / off-white linen
  background: "#FAF6F0",
  backgroundSecondary: "#F3EDE4",
  surface: "#FFFFFF",
  surfaceWarm: "#FDF8F3",

  // Accent — sage green (Personal category)
  sage: "#7A9E7E",
  sageLight: "#A8C5AB",
  sageDark: "#5A7D5D",
  sageMuted: "#DCE9DD",

  // Secondary — muted warm browns
  textPrimary: "#2C1E14",      // deep warm brown for headings
  textSecondary: "#7A5C45",    // medium muted brown for body
  textTertiary: "#B09070",     // light warm tan for captions/placeholders
  textOnDark: "#FAF6F0",       // cream text on dark backgrounds

  // Domain colors
  domainWork: "#C0603C",       // terracotta (same as primary)
  domainPersonal: "#7A9E7E",   // sage green
  domainFamily: "#C49A6C",     // warm amber / caramel

  // Status
  success: "#5A8A5A",
  warning: "#C49A2C",
  error: "#B84848",
  info: "#4A7A9E",

  // Quadrant colors (Priority Matrix)
  quadrantQ1: "#C0603C",   // Urgent + Important — terracotta (Do Now)
  quadrantQ2: "#7A9E7E",   // Not Urgent + Important — sage (Schedule)
  quadrantQ3: "#C49A6C",   // Urgent + Not Important — amber (Delegate)
  quadrantQ4: "#B09070",   // Not Urgent + Not Important — tan (Eliminate)

  // Neutral
  border: "#E8DDD0",
  borderLight: "#F0E8DC",
  divider: "#EDE4D8",
  shadow: "#2C1E14",        // shadow color (use with low opacity)

  // Transparent
  overlay: "rgba(44, 30, 20, 0.4)",
  shimmer: "rgba(250, 246, 240, 0.8)",
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const FontFamily = {
  // Headings: Lexend — bold, slightly condensed, highly legible
  headingBold: "Lexend_700Bold",
  headingSemiBold: "Lexend_600SemiBold",
  headingMedium: "Lexend_500Medium",
  headingRegular: "Lexend_400Regular",

  // Body: Plus Jakarta Sans — clean, modern, warm
  bodyBold: "PlusJakartaSans_700Bold",
  bodySemiBold: "PlusJakartaSans_600SemiBold",
  bodyMedium: "PlusJakartaSans_500Medium",
  bodyRegular: "PlusJakartaSans_400Regular",

  // Fallbacks (system fonts used until custom fonts load)
  fallbackHeading: "System",
  fallbackBody: "System",
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 16,     // body default — matches PRD spec
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,
  display: 40,
} as const;

export const LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,   // body default — matches PRD spec (1.5x)
  relaxed: 1.65,
  loose: 1.8,
} as const;

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
} as const;

// Prebuilt text styles
export const TextStyles = {
  displayBold: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.display,
    lineHeight: FontSize.display * LineHeight.tight,
    letterSpacing: LetterSpacing.tighter,
    color: Colors.textPrimary,
  },
  h1: {
    fontFamily: FontFamily.headingBold,
    fontSize: FontSize.xxxl,
    lineHeight: FontSize.xxxl * LineHeight.snug,
    letterSpacing: LetterSpacing.tight,
    color: Colors.textPrimary,
  },
  h2: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.xxl,
    lineHeight: FontSize.xxl * LineHeight.snug,
    letterSpacing: LetterSpacing.tight,
    color: Colors.textPrimary,
  },
  h3: {
    fontFamily: FontFamily.headingSemiBold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.normal,
    color: Colors.textPrimary,
  },
  h4: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.normal,
    color: Colors.textPrimary,
  },
  bodyLarge: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.normal,
    color: Colors.textSecondary,
  },
  body: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
    color: Colors.textSecondary,
  },
  bodySmall: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    color: Colors.textTertiary,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.snug,
    letterSpacing: LetterSpacing.wide,
    color: Colors.textSecondary,
  },
  caption: {
    fontFamily: FontFamily.bodyRegular,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.normal,
    color: Colors.textTertiary,
  },
  button: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  section: 48,
  page: 64,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────
// Soft, rounded shapes — "no hard edges, tactile feel"

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,   // cards, primary buttons
  xxl: 32,  // bottom sheets, large cards
  pill: 100,
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────
// Soft/diffuse — low opacity, large blur, minimal offset (PRD spec)

export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  // Subtle card lift
  xs: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  // Default card
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  // Floating elements
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  // Modals, sheets
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
  },
  // Hero elements
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 12,
  },
} as const;

// ─── Animation ───────────────────────────────────────────────────────────────

export const Animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  easing: {
    // Use with react-native-reanimated Easing
    standard: "ease-in-out",
    decelerate: "ease-out",
    accelerate: "ease-in",
    spring: "spring",
  },
} as const;

// ─── Z-Index ─────────────────────────────────────────────────────────────────

export const ZIndex = {
  base: 0,
  card: 10,
  header: 100,
  modal: 200,
  toast: 300,
  tooltip: 400,
} as const;

// ─── Theme Export ─────────────────────────────────────────────────────────────

const Theme = {
  Colors,
  FontFamily,
  FontSize,
  LineHeight,
  LetterSpacing,
  TextStyles,
  Spacing,
  Radius,
  Shadows,
  Animation,
  ZIndex,
} as const;

export default Theme;
