import { supabase } from '../lib/supabaseClient';
import type { Notification } from '../types/types';

export const NotificationsAPI = {
  getAll: async (): Promise<Notification[]> => {
    const { data, error } = await supabase.from<Notification>('notifications').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<Notification | null> => {
    const { data, error } = await supabase.from<Notification>('notifications').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (notification: Partial<Notification>): Promise<Notification> => {
    const { data, error } = await supabase.from<Notification>('notifications').insert([notification]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, notification: Partial<Notification>): Promise<Notification> => {
    const { data, error } = await supabase.from<Notification>('notifications').update(notification).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<Notification>('notifications').delete().eq('id', id);
    if (error) throw error;
  }
};
