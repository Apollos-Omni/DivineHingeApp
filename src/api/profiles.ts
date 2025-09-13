import { supabase } from "../lib/supabaseClient";
import type { Profile } from "../types/types";

export const ProfilesAPI = {
  getAll: async (): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<Profile>): Promise<Profile> => {
    const { data, error } = await supabase
      .from("profiles")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<Profile>): Promise<Profile> => {
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
