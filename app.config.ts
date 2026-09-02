import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Flow",
  slug: "flow",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "flow",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FAF6F0",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.imisihub.flow",
  },
  android: {
    package: "com.imisihub.flow",
    adaptiveIcon: {
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      backgroundColor: "#FAF6F0",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    "expo-sqlite",
    "expo-font",
    "expo-secure-store",
    [
      "expo-local-authentication",
      {
        faceIDPermission:
          "Allow Flow to use Face ID for secure authentication.",
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#C0603C",
        defaultChannel: "default",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: "your-eas-project-id", // TODO: replace after `eas init`
    },
  },
});
