import { create } from "zustand";

interface Avatar {
  id: string;
  level: number;
  experience: number;
  karma: number;
  upgrades: string[];
}

interface AvatarState {
  avatar: Avatar | null;
  setAvatar: (avatar: Avatar) => void;
  gainExperience: (xp: number) => void;
  gainKarma: (karma: number) => void;
  unlockUpgrade: (upgradeId: string) => void;
}

export const useAvatarState = create<AvatarState>((set, get) => ({
  avatar: null,
  setAvatar: (avatar) => set({ avatar }),
  gainExperience: (xp) => {
    const avatar = get().avatar;
    if (!avatar) return;
    const newExp = avatar.experience + xp;
    let newLevel = avatar.level;
    // Divine leveling logic: level up every 100 XP
    while (newExp >= newLevel * 100) {
      newLevel++;
    }
    set({
      avatar: {
        ...avatar,
        experience: newExp,
        level: newLevel,
      },
    });
  },
  gainKarma: (karma) => {
    const avatar = get().avatar;
    if (!avatar) return;
    set({
      avatar: {
        ...avatar,
        karma: avatar.karma + karma,
      },
    });
  },
  unlockUpgrade: (upgradeId) => {
    const avatar = get().avatar;
    if (!avatar) return;
    if (!avatar.upgrades.includes(upgradeId)) {
      set({
        avatar: {
          ...avatar,
          upgrades: [...avatar.upgrades, upgradeId],
        },
      });
    }
  },
}));
// Placeholder for avatarState.ts
