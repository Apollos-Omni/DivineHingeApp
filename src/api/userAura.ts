import { supabase } from '../lib/supabaseClient';
import type { UserAura } from '../types/types';

export const UserAuraAPI = {
  getAll: async (): Promise<UserAura[]> => {
    const { data, error } = await supabase.from<UserAura>('user_aura').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<UserAura | null> => {
    const { data, error } = await supabase.from<UserAura>('user_aura').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (aura: Partial<UserAura>): Promise<UserAura> => {
    const { data, error } = await supabase.from<UserAura>('user_aura').insert([aura]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, aura: Partial<UserAura>): Promise<UserAura> => {
    const { data, error } = await supabase.from<UserAura>('user_aura').update(aura).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<UserAura>('user_aura').delete().eq('id', id);
    if (error) throw error;
  }
};
