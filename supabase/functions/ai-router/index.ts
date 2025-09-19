// Supabase Edge Function: ai-router
// Route frontend AI tasks to orchestrator or external LLMs with guardrails.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = await req.json().catch(() => ({}));
  // TODO: validate JWT, scopes, and sanitize input
  // For now, just echo the task and pretend we queued it.
  return new Response(JSON.stringify({ ok: true, queued: body }), {
    headers: { "Content-Type": "application/json" },
  });
});
