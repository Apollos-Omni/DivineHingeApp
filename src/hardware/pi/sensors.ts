// src/hardware/pi/sensors.ts
export const readSensorData = async (): Promise<Record<string, any>> => {
  console.log("[Sensors] Reading data...");
  return {
    temperature: 72,
    humidity: 44,
    motion: false,
  };
};
