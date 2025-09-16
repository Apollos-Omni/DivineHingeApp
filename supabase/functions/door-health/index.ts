// Returns recent status for a device owned by the signed-in user.
// Body: { device_id?: string, limit?: number }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = { device_id?: string; limit?: number | string };

serve(async (req: Request): Promise<Response> => {
  try {
    const raw = (await req.json().catch(() => ({}))) as Payload;
    const device_id =
      typeof raw.device_id === "string" && raw.device_id.trim() ? raw.device_id.trim() : undefined;

    const limNum = Number(raw.limit ?? 20);
    const limit = Number.isFinite(limNum) ? Math.max(1, Math.min(50, limNum)) : 20;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }, // forward caller’s JWT → RLS applies
    });

    // Who’s calling?
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    // Latest device status
    let statusQuery = supabase
      .from("hinge_status")
      .select("device_id,battery,online,updated_at")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);
    if (device_id) statusQuery = statusQuery.eq("device_id", device_id);

    const { data: latestStatus, error: statusErr } = await statusQuery;
    if (statusErr) throw statusErr;

    // Recent events
    let eventsQuery = supabase
      .from("hinge_events")
      .select("device_id,event,created_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (device_id) eventsQuery = eventsQuery.eq("device_id", device_id);

    const { data: events, error: eventsErr } = await eventsQuery;
    if (eventsErr) throw eventsErr;

    return json({
      ok: true,
      device_id: device_id ?? latestStatus?.[0]?.device_id ?? null,
      latestStatus: latestStatus?.[0] ?? null,
      recentEvents: events ?? [],
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    return json({ ok: false, error: msg }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
