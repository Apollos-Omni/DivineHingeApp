// src/types/visionTypes.ts
// import { AuraSignature } from './auraTypes'; // Removed due to missing export

export type VisionStatus = "draft" | "active" | "archived";

export interface VisionTrail {
  // Define the properties of VisionTrail here
  steps: string[];
  completed: boolean;
}

export interface Vision {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string; // userId
  status: VisionStatus;
  tags?: string[];
  mirroredFrom?: string; // visionId if it's a mirror
  aura?: any; // Replace with correct type if available, or remove if not needed
  trail?: VisionTrail;
}
