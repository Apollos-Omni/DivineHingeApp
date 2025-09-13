import { supabase } from "../lib/supabaseClient";
import type { Notification } from "../types/types";

export const NotificationsAPI = {
  getAll: async (): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*");
    if (error) throw error;
    return data ?? [];
  },

  getById: async (id: string): Promise<Notification | null> => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  },

  create: async (row: Partial<Notification>): Promise<Notification> => {
    const { data, error } = await supabase
      .from("notifications")
      .insert(row)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  update: async (id: string, patch: Partial<Notification>): Promise<Notification> => {
    const { data, error } = await supabase
      .from("notifications")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data!;
  },

  remove: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
