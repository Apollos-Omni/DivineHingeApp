import { supabase } from "../lib/supabaseClient";
import type { HingeEvent } from "../types/types";

export const HingeEventsAPI = {
  getAll: async (): Promise<HingeEvent[]> => {
    const { data, error } = await supabase
      .from("hinge_events")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<HingeEvent | null> => {
    const { data, error } = await supabase
      .from("hinge_events")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<HingeEvent>): Promise<HingeEvent> => {
    const { data, error } = await supabase
      .from("hinge_events")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<HingeEvent>): Promise<HingeEvent> => {
    const { data, error } = await supabase
      .from("hinge_events")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("hinge_events")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
