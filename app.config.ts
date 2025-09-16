import "dotenv/config";
import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "DivineHingeApp",
  slug: "divinehingeapp",
  scheme: "divinehinge",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    url: "https://u.expo.dev/0a661c19-9075-48f4-9531-aee09cc7c15e",
  },
  runtimeVersion: { policy: "sdkVersion" },
  assetBundlePatterns: ["**/*"],

  ios: { supportsTablet: true },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.apollosdesigns.divinehingeapp",
  },

  web: { favicon: "./assets/favicon.png" },

  // ✅ Only actual config plugins here
  plugins: [
    ["expo-build-properties", { android: { minSdkVersion: 25 } }],
    [
      "sentry-expo",
      {
        // Optional; you can also configure via Sentry.init in code.
        organization: "<your-sentry-org>",
        project: "<your-sentry-project>",
      },
    ],
  ],

  // ✅ Put all custom values under extra
  extra: {
    eas: { projectId: "0a661c19-9075-48f4-9531-aee09cc7c15e" },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default config;
