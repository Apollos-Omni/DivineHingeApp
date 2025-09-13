import { supabase } from "../lib/supabaseClient";
import type { UserAura } from "../types/types";

export const UserAuraAPI = {
  getAll: async (): Promise<UserAura[]> => {
    const { data, error } = await supabase
      .from("user_aura")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<UserAura | null> => {
    const { data, error } = await supabase
      .from("user_aura")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<UserAura>): Promise<UserAura> => {
    const { data, error } = await supabase
      .from("user_aura")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<UserAura>): Promise<UserAura> => {
    const { data, error } = await supabase
      .from("user_aura")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("user_aura")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
