// src/ui/index.ts

import { Audio } from 'expo-av';
import { Vibration } from 'react-native';

// Placeholder for canvas or native rendering
export function renderWorld(state: any) {
  console.log(`[Render] Player at (${state.player.x}, ${state.player.y})`);
}

// Stats, score, warnings, etc.
export function updateUI(state: any) {
  console.log(`[UI] Time: ${state.time}, Anomaly: ${state.anomalyDetected}`);
}

// Plays sound by name
export async function playSound(sound: string) {
  try {
    const { sound: soundObject } = await Audio.Sound.createAsync(
      // Replace with local sound file logic
    require('../assets/backgrounds/images24.png') // Example path
    );
    await soundObject.playAsync();
  } catch (err) {
    console.error(`[Sound] Failed to play sound: ${err}`);
  }
}

// Haptic feedback
export function vibrate(ms: number = 100) {
  Vibration.vibrate(ms);
}
