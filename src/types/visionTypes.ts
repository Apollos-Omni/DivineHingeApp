// src/types/visionTypes.ts

export type VisionStatus = 'draft' | 'active' | 'archived';

export interface Vision {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;        // userId
  status: VisionStatus;
  tags?: string[];
  mirroredFrom?: string;    // visionId if it's a mirror
  aura?: AuraSignature;
  trail?: VisionTrail;
}
