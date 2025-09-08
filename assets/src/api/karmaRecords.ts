import { supabase } from '../lib/supabaseClient';
import type { KarmaRecord } from '../types/types';

export const KarmaRecordsAPI = {
  getAll: async (): Promise<KarmaRecord[]> => {
    const { data, error } = await supabase.from<KarmaRecord>('karma_records').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<KarmaRecord | null> => {
    const { data, error } = await supabase.from<KarmaRecord>('karma_records').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (record: Partial<KarmaRecord>): Promise<KarmaRecord> => {
    const { data, error } = await supabase.from<KarmaRecord>('karma_records').insert([record]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, record: Partial<KarmaRecord>): Promise<KarmaRecord> => {
    const { data, error } = await supabase.from<KarmaRecord>('karma_records').update(record).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<KarmaRecord>('karma_records').delete().eq('id', id);
    if (error) throw error;
  }
};
