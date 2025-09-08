import { supabase } from '../lib/supabaseClient';
import type { Vision } from '../types/types';

export const VisionsAPI = {
  getAll: async (): Promise<Vision[]> => {
    const { data, error } = await supabase.from<Vision>('visions').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<Vision | null> => {
    const { data, error } = await supabase.from<Vision>('visions').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (vision: Partial<Vision>): Promise<Vision> => {
    const { data, error } = await supabase.from<Vision>('visions').insert([vision]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, vision: Partial<Vision>): Promise<Vision> => {
    const { data, error } = await supabase.from<Vision>('visions').update(vision).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<Vision>('visions').delete().eq('id', id);
    if (error) throw error;
  }
};
