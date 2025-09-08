import { supabase } from '../lib/supabaseClient';
import type { HingeEvent } from '../types/types';

export const HingeEventsAPI = {
  getAll: async (): Promise<HingeEvent[]> => {
    const { data, error } = await supabase.from<HingeEvent>('hinge_events').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<HingeEvent | null> => {
    const { data, error } = await supabase.from<HingeEvent>('hinge_events').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (event: Partial<HingeEvent>): Promise<HingeEvent> => {
    const { data, error } = await supabase.from<HingeEvent>('hinge_events').insert([event]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, event: Partial<HingeEvent>): Promise<HingeEvent> => {
    const { data, error } = await supabase.from<HingeEvent>('hinge_events').update(event).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<HingeEvent>('hinge_events').delete().eq('id', id);
    if (error) throw error;
  }
};
