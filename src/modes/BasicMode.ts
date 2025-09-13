// src/modes/BasicMode.ts
import { setupGPIO } from "../hardware/pi/gpio";
import { readSensorData } from "../hardware/pi/sensors";

export const runBasicMode = async () => {
  console.log("[BasicMode] Running...");

  setupGPIO();

  const data = await readSensorData();
  console.log("[BasicMode] Sensor Data:", data);

  // Insert basic logic: home automation, feedback, alerts, etc.
};
