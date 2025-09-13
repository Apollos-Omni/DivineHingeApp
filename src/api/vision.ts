import { supabase } from "../lib/supabaseClient";
import type { Vision } from "../types/types";

export const VisionsAPI = {
  getAll: async (): Promise<Vision[]> => {
    const { data, error } = await supabase
      .from("visions")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<Vision | null> => {
    const { data, error } = await supabase
      .from("visions")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<Vision>): Promise<Vision> => {
    const { data, error } = await supabase
      .from("visions")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<Vision>): Promise<Vision> => {
    const { data, error } = await supabase
      .from("visions")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("visions")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
