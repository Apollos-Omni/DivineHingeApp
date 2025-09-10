// src/modules/avatar/avatarCore.ts

import { useUserStore } from '../state/userStore';
import { useHingeStore, HingeData } from '../state/hingeStore';
import { Vision } from '../types/visionTypes';

/**
 * Core avatar shape used by UI and game logic.
 */
export interface AvatarCore {
  userId: string;
  name: string;
  role: 'observer' | 'guardian' | 'admin' | 'builder';
  karma: number;
  location: string;
  lastSeen: number; // epoch ms
  unlockedHinges: string[]; // hinge IDs
  currentVision?: Vision;
  auraLevel: number; // derived from karma
}

/**
 * Compute a compact "aura" score from karma.
 * Clamped to [0, 10] to keep UI stable.
 */
const computeAuraLevel = (karma: number): number => {
  const n = Number.isFinite(karma) ? karma : 0;
  // WHY: Stabilize UI ranges regardless of wild karma values.
  const scaled = Math.floor(n / 100);
  return Math.max(0, Math.min(10, scaled));
};

/**
 * Treat hinges state as array regardless of storage shape.
 */
const toArray = (hinges: Record<string, HingeData> | HingeData[] | undefined | null): HingeData[] => {
  if (!hinges) return [];
  return Array.isArray(hinges) ? hinges : Object.values(hinges);
};

/**
 * Narrow the role to one of the allowed literals.
 */
const coerceRole = (value: unknown): AvatarCore['role'] => {
  const allowed: AvatarCore['role'][] = ['observer', 'guardian', 'admin', 'builder'];
  return allowed.includes(value as AvatarCore['role']) ? (value as AvatarCore['role']) : 'observer';
};

/**
 * Select unlocked hinge IDs from the hinge store.
 */
export const selectUnlockedHingeIds = (): string[] => {
  const { hinges } = useHingeStore.getState() as { hinges?: Record<string, HingeData> | HingeData[] };
  return toArray(hinges)
    .filter((h): h is HingeData => Boolean(h) && typeof (h as HingeData).id === 'string' && typeof (h as HingeData).isLocked === 'boolean')
    .filter((h) => !h.isLocked)
    .map((h) => h.id);
};

/**
 * Build a complete AvatarCore snapshot from stores.
 */
export const buildAvatarCore = (): AvatarCore => {
  const userState = useUserStore.getState() as any; // "any" to avoid coupling to store internals

  const userId: string = String(userState.userId ?? userState.id ?? 'unknown');
  const name: string = String(userState.name ?? 'Anonymous');
  const role: AvatarCore['role'] = coerceRole(userState.role);
  const karma: number = Number.isFinite(userState.karma) ? Number(userState.karma) : 0;
  const location: string = String(userState.location ?? '');
  const lastSeen: number = Number.isFinite(userState.lastSeen) ? Number(userState.lastSeen) : Date.now();
  const unlockedHinges: string[] = selectUnlockedHingeIds();
  const currentVision: Vision | undefined = userState.activeVision as Vision | undefined;
  const auraLevel = computeAuraLevel(karma);

  return {
    userId,
    name,
    role,
    karma,
    location,
    lastSeen,
    unlockedHinges,
    currentVision,
    auraLevel,
  };
};

/**
 * Adjust user karma by delta.
 */
export const updateAvatarKarma = (delta: number): void => {
  const safeDelta = Number.isFinite(delta) ? Number(delta) : 0;

  // WHY: Some codebases expose actions, others rely on setState; support both.
  const store = useUserStore as unknown as {
    getState: () => any;
    setState: (partial: any | ((s: any) => any), replace?: boolean) => void;
  };

  const state = store.getState();

  if (state && typeof state.updateUserKarma === 'function') {
    state.updateUserKarma(safeDelta);
    return;
  }

  store.setState((s: any) => ({
    karma: (Number.isFinite(s?.karma) ? Number(s.karma) : 0) + safeDelta,
  }));
};
  updateUserKarma(Number(delta) || 0);
};

/**
 * Assign a new active vision to the user.
 */
export const assignNewVision = (vision: Vision): void => {
  const store = useUserStore as unknown as {
    getState: () => any;
    setState: (partial: any | ((s: any) => any), replace?: boolean) => void;
  };

  const state = store.getState();

  if (state && typeof state.setActiveVision === 'function') {
    state.setActiveVision(vision);
    return;
  }

  store.setState({ activeVision: vision });
};
  setActiveVision(vision);
};

// Convenience re-exports for compatibility
export type { HingeData };
