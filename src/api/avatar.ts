import { supabase } from '../lib/supabaseClient';
import type { Avatar } from '../types/types';

export const AvatarsAPI = {
  getAll: async (): Promise<Avatar[]> => {
    const { data, error } = await supabase
      .from<Avatar>('avatars')
      .select('*');

    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<Avatar | null> => {
    const { data, error } = await supabase
      .from<Avatar>('avatars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data!;
  },

  create: async (avatar: Partial<Avatar>): Promise<Avatar> => {
    const { data, error } = await supabase
      .from<Avatar>('avatars')
      .insert([avatar])
      .select()
      .single();

    if (error) throw error;
    return data!;
  },

  update: async (id: string, avatar: Partial<Avatar>): Promise<Avatar> => {
    const { data, error } = await supabase
      .from<Avatar>('avatars')
      .update(avatar)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from<Avatar>('avatars')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
