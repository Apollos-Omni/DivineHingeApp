import { supabase } from '../lib/supabaseClient';
import type { NeuralMirror } from '../types/types';

export const NeuralMirrorsAPI = {
  getAll: async (): Promise<NeuralMirror[]> => {
    const { data, error } = await supabase.from<NeuralMirror>('neural_mirrors').select('*');
    if (error) throw error;
    return data!;
  },

  getById: async (id: string): Promise<NeuralMirror | null> => {
    const { data, error } = await supabase.from<NeuralMirror>('neural_mirrors').select('*').eq('id', id).single();
    if (error) throw error;
    return data!;
  },

  create: async (mirror: Partial<NeuralMirror>): Promise<NeuralMirror> => {
    const { data, error } = await supabase.from<NeuralMirror>('neural_mirrors').insert([mirror]).select().single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, mirror: Partial<NeuralMirror>): Promise<NeuralMirror> => {
    const { data, error } = await supabase.from<NeuralMirror>('neural_mirrors').update(mirror).eq('id', id).select().single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from<NeuralMirror>('neural_mirrors').delete().eq('id', id);
    if (error) throw error;
  }
};
