// src/modes/ModeManager.ts
export type AppMode = "basic" | "game";

let currentMode: AppMode = "basic";

export const getCurrentMode = (): AppMode => currentMode;

export const setMode = (mode: AppMode) => {
  if (mode !== "basic" && mode !== "game") throw new Error("Invalid mode");
  currentMode = mode;
  console.log(`[MODE] Switched to ${mode.toUpperCase()} mode.`);
};
