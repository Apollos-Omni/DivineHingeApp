// src/lib/utils.ts

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getFPS(delta: number): number {
  return 1000 / delta;
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function generateVisionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `vision_${timestamp}_${random}`;
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}