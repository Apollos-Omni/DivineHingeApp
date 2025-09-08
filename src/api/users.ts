import { supabase } from '../lib/supabaseClient';
import type { User } from '../types/types';

export const UsersAPI = {
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase.from<User>('users').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase.from<User>('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (user: Partial<User>): Promise<User> => {
    const { data, error } = await supabase.from<User>('users').insert([user]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const { data, error } = await supabase.from<User>('users').update(user).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<User>('users').delete().eq('id', id);
    if (error) throw error;
  }
};
