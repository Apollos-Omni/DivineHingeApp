export type AuraState = "radiant" | "neutral" | "dim" | "burned";

export interface UserAura {
  userId: string;
  currentAura: AuraState;
  lastUpdated: number;
  influencerIds?: string[];
}
