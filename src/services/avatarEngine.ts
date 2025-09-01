import { useUserStore } from '@/state/userStore';
import { useHingeStore } from '@/state/hingeStore';
import { Vision } from '@/types/vision';
import { HingeData } from '@/state/hingeStore';

export interface AvatarCore {
  userId: string;
  name: string;
  role: 'observer' | 'guardian' | 'admin' | 'builder';
  karma: number;
  location: string;
  lastSeen: number;
  unlockedHinges: string[];
  currentVision?: Vision;
  auraLevel: number;
}

export const getAvatarProfile = (): AvatarCore | null => {
  const user = useUserStore.getState().user;
  if (!user) return null;

  return {
    userId: user.id,
    name: user.name,
    role: user.role,
    karma: user.karma || 0,
    location: user.lastKnownLocation || 'unknown',
    lastSeen: Date.now(),
    unlockedHinges: getUnlockedHinges(user.id),
    currentVision: user.activeVision,
    auraLevel: calculateAura(user.karma),
  };
};

export const calculateAura = (karma: number): number => {
  if (karma > 9000) return 10;
  if (karma > 1000) return 7;
  if (karma > 100) return 5;
  if (karma > 10) return 3;
  return 1;
};

export const getUnlockedHinges = (userId: string): string[] => {
  const hinges = useHingeStore.getState().hinges;
  return Object.values(hinges)
    .filter((hinge: HingeData) => !hinge.isLocked)
    .map((hinge) => hinge.id);
};

export const updateAvatarKarma = (delta: number) => {
  const { updateUserKarma } = useUserStore.getState();
  updateUserKarma(delta);
};

export const assignNewVision = (vision: Vision) => {
  const { setActiveVision } = useUserStore.getState();
  setActiveVision(vision);
};
