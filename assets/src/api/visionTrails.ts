import { supabase } from '../lib/supabaseClient';
import type { VisionTrail } from '../types/types';

export const VisionTrailsAPI = {
  getAll: async (): Promise<VisionTrail[]> => {
    const { data, error } = await supabase.from<VisionTrail>('vision_trails').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<VisionTrail | null> => {
    const { data, error } = await supabase.from<VisionTrail>('vision_trails').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (trail: Partial<VisionTrail>): Promise<VisionTrail> => {
    const { data, error } = await supabase.from<VisionTrail>('vision_trails').insert([trail]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, trail: Partial<VisionTrail>): Promise<VisionTrail> => {
    const { data, error } = await supabase.from<VisionTrail>('vision_trails').update(trail).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<VisionTrail>('vision_trails').delete().eq('id', id);
    if (error) throw error;
  }
};
