// src/modes/GameMode.ts
import { runGameLoop } from '@/game/loop';
import { setupI2C } from '@/hardware/pi/i2c';

export const runGameMode = () => {
  console.log('[GameMode] Initializing Game Mode...');
  setupI2C();

  runGameLoop(); // coming soon: immersive simulation engine
};
