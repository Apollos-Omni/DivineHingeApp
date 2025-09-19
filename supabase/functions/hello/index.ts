/** Minimal Supabase Edge Function: hello */
Deno.serve((_req) => new Response(JSON.stringify({ ok: true, message: "Hello from Edge Functions" }), {
  headers: { "content-type": "application/json" }
}));
