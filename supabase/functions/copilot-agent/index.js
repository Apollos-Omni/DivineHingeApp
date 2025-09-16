// supabase/functions/copilot-agent/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  const _ghToken = req.headers.get("X-GitHub-Token") ?? "";
  const _body = await req.json().catch(() => ({}));
  // TODO: inspect body.messages, body.context, etc. and do real work.
  const reply = "DivineHinge Agent is wired up. Tell me a build error to investigate.";
  return new Response(JSON.stringify({ reply }), { headers: { "content-type": "application/json" } });
});
