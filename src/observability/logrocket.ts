import LogRocket from "@logrocket/react-native";
import * as Updates from "expo-updates";
import { NativeModules } from "react-native";

export function initLogRocket() {
  // Prove native module is present
  console.log(
    "LogRocket native present?",
    !!(NativeModules as any).LogRocketReactNative
  );

  LogRocket.init("5gel2z/divinehingeapp", {
    updateId: Updates.isEmbeddedLaunch ? null : (Updates.updateId ?? null),
    expoChannel: Updates.channel ?? null,
  });

  console.log("LogRocket.init() called");

  // Session URL arrives only after the backend accepts the session (1–5s).
  setTimeout(() => {
    (LogRocket as any).getSessionURL?.((url: string) => {
      console.log("LogRocket session URL:", url);
    });
  }, 5000);
}
