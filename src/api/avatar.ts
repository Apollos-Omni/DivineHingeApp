// src/api/avatar.ts
import { supabase } from "../lib/supabaseClient";
import type { Avatar } from "../types/types";

export const AvatarsAPI = {
  // list
  getAll: async (): Promise<Avatar[]> => {
    const { data, error } = await supabase.from("avatars").select("*");
    if (error) throw error;
    return data ?? [];
  },

  // one (exactly one expected)
  getById: async (id: string): Promise<Avatar | null> => {
    const { data, error } = await supabase
      .from("avatars")
      .select("*")
      .eq("id", id)
      .single(); // throws if 0 or >1 rows
    if (error) throw error;
    return data ?? null;
  },

  // insert one
  create: async (avatar: Partial<Avatar>): Promise<Avatar> => {
    const { data, error } = await supabase
      .from("avatars")
      .insert(avatar)      // object is fine; array also works
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  // update one
  update: async (id: string, avatar: Partial<Avatar>): Promise<Avatar> => {
    const { data, error } = await supabase
      .from("avatars")
      .update(avatar)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  // delete one
  remove: async (id: string): Promise<void> => {
    const { error } = await supabase.from("avatars").delete().eq("id", id);
    if (error) throw error;
  },
};
