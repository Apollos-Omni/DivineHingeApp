import { supabase } from "../lib/supabaseClient";
import type { KarmaRecord } from "../types/types";

export const KarmaRecordsAPI = {
  getAll: async (): Promise<KarmaRecord[]> => {
    const { data, error } = await supabase
      .from("karma_records")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<KarmaRecord | null> => {
    const { data, error } = await supabase
      .from("karma_records")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<KarmaRecord>): Promise<KarmaRecord> => {
    const { data, error } = await supabase
      .from("karma_records")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<KarmaRecord>): Promise<KarmaRecord> => {
    const { data, error } = await supabase
      .from("karma_records")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("karma_records")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
