// supabase/functions/github-webhook/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const enc = new TextEncoder();
const SECRET = Deno.env.get("GITHUB_WEBHOOK_SECRET") ?? "";

function timingSafeEqual(a: string, b: string) {
  const A = enc.encode(a), B = enc.encode(b);
  if (A.length !== B.length) return false;
  let out = 0;
  for (let i = 0; i < A.length; i++) out |= A[i] ^ B[i];
  return out === 0;
}
async function hmac256(key: string, data: string) {
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return "sha256=" + [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2,"0")).join("");
}

serve(async (req) => {
  // Respond to GitHub's "ping" quickly (handy during setup)
  if (req.headers.get("X-GitHub-Event") === "ping") {
    return new Response(JSON.stringify({ pong: true }), { status: 200, headers: { "content-type": "application/json" }});
  }

  const body = await req.text();
  const sig = req.headers.get("X-Hub-Signature-256") ?? "";
  if (!SECRET) return new Response("Missing secret", { status: 500 });
  const expected = await hmac256(SECRET, body);
  if (!timingSafeEqual(expected, sig)) return new Response("Bad signature", { status: 401 });

  const event = req.headers.get("X-GitHub-Event") ?? "";
  const payload = JSON.parse(body);

  // ---- Handle only what you subscribe to ----
  if (event === "push") {
    console.log(`Push to ${payload.repository.full_name} @ ${payload.after}`);
    // TODO: trigger whatever you need (queue job, write to Supabase, call EAS, etc.)
  } else if (event === "pull_request") {
    console.log(`PR ${payload.action} #${payload.number}`);
  }

  return new Response("ok", { status: 200 });
});
