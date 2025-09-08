import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types/types';

export const ProfilesAPI = {
  getAll: async (): Promise<Profile[]> => {
    const { data, error } = await supabase.from<Profile>('profiles').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<Profile | null> => {
    const { data, error } = await supabase.from<Profile>('profiles').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (profile: Partial<Profile>): Promise<Profile> => {
    const { data, error } = await supabase.from<Profile>('profiles').insert([profile]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, profile: Partial<Profile>): Promise<Profile> => {
    const { data, error } = await supabase.from<Profile>('profiles').update(profile).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<Profile>('profiles').delete().eq('id', id);
    if (error) throw error;
  }
};
