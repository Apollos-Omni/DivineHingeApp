// src/game/engine.ts

import { getSensorData } from "../hardware/sensors";
import { playSound, updateUI, renderWorld, vibrate } from "../ui";

let worldState = {
  player: {
    x: 0,
    y: 0,
    velocity: 1,
  },
  time: 0,
  anomalyDetected: false,
};

export function handleUserInput() {
  // Placeholder for real input (touch, keyboard, gamepad)
  // Update player movement
  const keys = globalThis.input || {};
  if (keys["ArrowUp"]) worldState.player.y -= worldState.player.velocity;
  if (keys["ArrowDown"]) worldState.player.y += worldState.player.velocity;
  if (keys["ArrowLeft"]) worldState.player.x -= worldState.player.velocity;
  if (keys["ArrowRight"]) worldState.player.x += worldState.player.velocity;
}

export function updateWorldState(delta: number) {
  worldState.time += delta;

  // Example: Integrate sensor data if running on Pi
  const sensorData = getSensorData();
  if (sensorData && sensorData.motionDetected) {
    worldState.player.x += sensorData.intensity;
  }

  // Game physics, collisions, time-based events here
}

export function detectAnomalies() {
  // Detect abnormal player states
  if (worldState.player.x < 0 || worldState.player.y < 0) {
    worldState.anomalyDetected = true;
    console.warn("[Engine] Anomaly detected: Negative position");
    vibrate(300); // Optional haptic warning
  } else {
    worldState.anomalyDetected = false;
  }
}

export function renderScene() {
  renderWorld(worldState); // Canvas, UI animation
  updateUI(worldState); // Stats, score, energy
  if (worldState.anomalyDetected) {
    playSound("alarm");
  }
}
