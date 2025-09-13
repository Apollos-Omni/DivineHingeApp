import { supabase } from "../lib/supabaseClient";
import type { NeuralMirror } from "../types/types";

export const NeuralMirrorsAPI = {
  getAll: async (): Promise<NeuralMirror[]> => {
    const { data, error } = await supabase
      .from("neural_mirrors")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<NeuralMirror | null> => {
    const { data, error } = await supabase
      .from("neural_mirrors")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<NeuralMirror>): Promise<NeuralMirror> => {
    const { data, error } = await supabase
      .from("neural_mirrors")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<NeuralMirror>): Promise<NeuralMirror> => {
    const { data, error } = await supabase
      .from("neural_mirrors")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("neural_mirrors")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
