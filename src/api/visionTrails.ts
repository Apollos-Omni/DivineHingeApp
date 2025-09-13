import { supabase } from "../lib/supabaseClient";
import type { VisionTrail } from "../types/types";

export const VisionTrailsAPI = {
  getAll: async (): Promise<VisionTrail[]> => {
    const { data, error } = await supabase
      .from("vision_trails")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<VisionTrail | null> => {
    const { data, error } = await supabase
      .from("vision_trails")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<VisionTrail>): Promise<VisionTrail> => {
    const { data, error } = await supabase
      .from("vision_trails")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<VisionTrail>): Promise<VisionTrail> => {
    const { data, error } = await supabase
      .from("vision_trails")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("vision_trails")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
