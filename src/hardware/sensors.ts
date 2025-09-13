// src/hardware/sensors.ts
import { Platform } from "react-native";

export type SensorData = { motionDetected: boolean; intensity: number };

export function getSensorData(): SensorData {
  // Treat native targets as “hardware path”; web stays on mock
  const isNative = Platform.OS !== "web";

  if (isNative) {
    // TODO: real I2C on Raspberry Pi / native bridge
    return {
      motionDetected: Math.random() > 0.8,
      intensity: Math.floor(Math.random() * 3),
    };
  }

  // Browser/dev fallback
  return {
    motionDetected: Math.random() > 0.95,
    intensity: Math.floor(Math.random() * 5),
  };
}
