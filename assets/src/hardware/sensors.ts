// src/hardware/sensors.ts

// Replace this with actual I2C logic when running on hardware
export function getSensorData() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // TODO: Add actual I2C communication for Raspberry Pi here
    return {
      motionDetected: Math.random() > 0.8,
      intensity: Math.floor(Math.random() * 3),
    };
  } else {
    // Fallback mock for browser/dev
    return {
      motionDetected: Math.random() > 0.95,
      intensity: Math.floor(Math.random() * 5),
    };
  }
}
