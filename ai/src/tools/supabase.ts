import { createClient } from "@supabase/supabase-js";
import type { AppConfig } from "../ai.config.js";

export function supabaseClient(cfg: AppConfig) {
  return createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: false },
    global: { fetch: (...a) => fetch(...a) },
  });
}

/** Minimal task record */
export type AiTask = {
  id: string;
  status: "queued" | "running" | "done" | "error";
  input: any;
  result?: any;
};

export async function recordEvent(cfg: AppConfig, taskId: string, message: string) {
  const supa = supabaseClient(cfg);
  await supa.from("ai_events").insert({ task_id: taskId, message });
}
