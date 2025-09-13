// src/vision/engine.ts
import { generateVisionId, getCurrentTimestamp } from "../lib/utils";
import type { VisionSchema } from "../database/schemas";
import { VisionStatus } from "../database/schemas";

export class VisionEngine {
  private visions: VisionSchema[] = [];

  createVision(input: Partial<VisionSchema>): VisionSchema {
    const now = getCurrentTimestamp();

    // Build the record explicitly without repeating keys or using spreads
    // that could reintroduce duplicate properties.
    const vision: VisionSchema = {
      id: generateVisionId(),
      createdAt: now,
      updatedAt: now,

      // Required fields with safe defaults:
      title: input.title ?? "Untitled Vision",
      description: input.description ?? "",
      tags: input.tags ?? [],
      status: input.status ?? VisionStatus.Draft, // ← correct enum case

      // Schema requires userId: string (no undefined)
      userId: input.userId ?? "",

      // Optional fields (only include those that exist in your VisionSchema)
      isPublic: input.isPublic ?? false,
    };

    this.visions.push(vision);
    return vision;
  }

  updateVision(id: string, updates: Partial<VisionSchema>): VisionSchema | null {
    const vision = this.visions.find((v) => v.id === id);
    if (!vision) return null;

    // Only assign known keys; skip undefined to avoid clobbering
    const next: Partial<VisionSchema> = {
      title: updates.title,
      description: updates.description,
      tags: updates.tags,
      status: updates.status,
      isPublic: updates.isPublic,
      userId: updates.userId, // keep if your schema allows changing owner; else remove this line
    };
    Object.entries(next).forEach(([k, v]) => {
      if (v !== undefined) {
        (vision as any)[k] = v;
      }
    });

    vision.updatedAt = getCurrentTimestamp();
    return vision;
  }

  getAllVisions(): VisionSchema[] {
    return this.visions;
  }

  getVisionById(id: string): VisionSchema | null {
    return this.visions.find((v) => v.id === id) ?? null;
  }

  deleteVision(id: string): boolean {
    const idx = this.visions.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    this.visions.splice(idx, 1);
    return true;
  }
}
