import { supabase } from "../lib/supabaseClient";
import type { User } from "../types/types";

export const UsersAPI = {
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from("users")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<User>): Promise<User> => {
    const { data, error } = await supabase
      .from("users")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<User>): Promise<User> => {
    const { data, error } = await supabase
      .from("users")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
