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
  extra: { eas: { projectId: "0a661c19-9075-48f4-9531-aee09cc7c15e" } },
};

export default config;
