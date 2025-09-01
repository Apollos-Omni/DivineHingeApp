// src/vision/engine.ts
import { generateVisionId, getCurrentTimestamp } from './utils';
import { VisionSchema, VisionStatus } from './schema';

export class VisionEngine {
  private visions: VisionSchema[] = [];

  createVision(input: Partial<VisionSchema>): VisionSchema {
    const vision: VisionSchema = {
      id: generateVisionId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      title: input.title || 'Untitled Vision',
      description: input.description || '',
      tags: input.tags || [],
      status: VisionStatus.DRAFT,
      karma: 0,
      creatorId: input.creatorId || '',
      ...input,
    };
    this.visions.push(vision);
    return vision;
  }

  updateVision(id: string, updates: Partial<VisionSchema>): VisionSchema | null {
    const vision = this.visions.find((v) => v.id === id);
    if (!vision) return null;
    Object.assign(vision, updates);
    vision.updatedAt = getCurrentTimestamp();
    return vision;
  }

  getAllVisions(): VisionSchema[] {
    return this.visions;
  }

  getVisionById(id: string): VisionSchema | null {
    return this.visions.find((v) => v.id === id) || null;
  }

  deleteVision(id: string): boolean {
    const index = this.visions.findIndex((v) => v.id === id);
    if (index === -1) return false;
    this.visions.splice(index, 1);
    return true;
  }
}
