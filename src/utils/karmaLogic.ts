import { useUserStore } from '@/state/userStore';

type KarmaAction =
  | 'vision_completed'
  | 'vision_abandoned'
  | 'comment_helpful'
  | 'vote_cast'
  | 'vote_ignored'
  | 'hinge_unlocked'
  | 'hinge_locked'
  | 'reaction_positive'
  | 'reaction_negative'
  | 'legacy_impact';

const karmaWeights: Record<KarmaAction, number> = {
  vision_completed: 100,
  vision_abandoned: -50,
  comment_helpful: 15,
  vote_cast: 5,
  vote_ignored: -2,
  hinge_unlocked: 25,
  hinge_locked: -10,
  reaction_positive: 10,
  reaction_negative: -10,
  legacy_impact: 500,
};

export const applyKarma = (action: KarmaAction) => {
  const { updateUserKarma } = useUserStore.getState();
  const value = karmaWeights[action];
  updateUserKarma(value);
};

export const calculateKarmaBonus = (karma: number): string => {
  if (karma > 10000) return 'Transcendent';
  if (karma > 3000) return 'Legendary';
  if (karma > 1000) return 'Ascended';
  if (karma > 300) return 'Influential';
  if (karma > 50) return 'Recognized';
  return 'Seedling';
};

export const getKarmaColor = (karma: number): string => {
  if (karma > 10000) return '#DA00FF';
  if (karma > 3000) return '#8B00FF';
  if (karma > 1000) return '#5B00E3';
  if (karma > 300) return '#4000A0';
  if (karma > 50) return '#444';
  return '#999';
};
