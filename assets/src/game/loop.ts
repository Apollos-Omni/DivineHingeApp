// src/game/loop.ts

import { updateWorldState, renderScene, handleUserInput, detectAnomalies } from './engine';
import { getFPS, sleep } from '../lib/utils';

let isRunning = false;
const TARGET_FPS = 60;
const FRAME_DURATION = 1000 / TARGET_FPS; // 16.66ms for 60fps

export const runGameLoop = async () => {
  if (isRunning) return;
  isRunning = true;

  console.log('[Loop] Game Loop started.');

  let lastFrameTime = performance.now();

  const loop = async () => {
    if (!isRunning) return;

    const now = performance.now();
    const delta = now - lastFrameTime;

    if (delta >= FRAME_DURATION) {
      lastFrameTime = now;

      try {
        handleUserInput();                     // Listen for inputs (touch, click, sensor)
        updateWorldState(delta);              // Physics, AI, environmental shifts
        detectAnomalies();                    // Optional: Detect unexpected states or hacks
        renderScene();                        // Draw visuals, sounds, haptics
      } catch (error) {
        console.error('[Loop] Error in game loop:', error);
        isRunning = false;
        return;
      }
    }

    const timeToNextFrame = FRAME_DURATION - (performance.now() - lastFrameTime);
    await sleep(Math.max(0, timeToNextFrame));

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
};

export const stopGameLoop = () => {
  console.log('[Loop] Game Loop stopped.');
  isRunning = false;
};
