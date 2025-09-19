import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { supabase } from "@/lib/supabaseClient"; // ← change if your client path differs

// -------- Types that match your Edge Function shape --------
type DoorEvent = { device_id: string; event: string; created_at: string };
type DoorStatus = { device_id: string; battery: number | null; online: boolean; updated_at: string };
type DoorHealthResponse = {
  ok: boolean;
  device_id: string | null;
  latestStatus: DoorStatus | null;
  recentEvents: DoorEvent[];
  error?: string;
};

// -------- Hook to fetch door health --------
export function useDoorHealth(deviceId?: string, auto = true) {
  const [data, setData] = useState<DoorHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke<DoorHealthResponse>("door-health", {
        body: { device_id: deviceId, limit: 10 },
      });

      if (error) throw error;
      if (!data) throw new Error("No data returned");

      setData(data);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    if (auto) fetchHealth();
  }, [auto, fetchHealth]);

  return { data, loading, error, refresh: fetchHealth };
}

// -------- The Card component --------
export default function DoorHealthCard({ deviceId }: { deviceId?: string }) {
  const { data, loading, error, refresh } = useDoorHealth(deviceId);

  const batteryPct = useMemo(() => {
    const raw = data?.latestStatus?.battery;
    if (raw == null || Number.isNaN(raw)) return null;
    return Math.max(0, Math.min(100, raw));
  }, [data?.latestStatus?.battery]);

  const batteryColor = useMemo(() => {
    if (batteryPct == null) return "#9CA3AF"; // gray
    if (batteryPct >= 67) return "#10B981";   // green
    if (batteryPct >= 34) return "#F59E0B";   // amber
    return "#EF4444";                          // red
  }, [batteryPct]);

  const online = data?.latestStatus?.online ?? false;

  return (
    <View style={{
      backgroundColor: "#0b0b0f",
      borderRadius: 16,
      padding: 16,
      borderColor: "#262635",
      borderWidth: 1
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
          Door Health {data?.device_id ? `· ${data.device_id}` : ""}
        </Text>

        <Pressable
          onPress={refresh}
          style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#6D28D9", borderRadius: 10 }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ color: "white", fontWeight: "600" }}>Refresh</Text>
          )}
        </Pressable>
      </View>

      {/* Status row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, gap: 16 }}>
        {/* Online pill */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{
            width: 10, height: 10, borderRadius: 9999,
            backgroundColor: online ? "#22C55E" : "#EF4444"
          }} />
          <Text style={{ color: online ? "#22C55E" : "#EF4444", fontWeight: "600" }}>
            {online ? "Online" : "Offline"}
          </Text>
        </View>

        {/* Battery bar */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#A7AAB4", fontSize: 12, marginBottom: 4 }}>Battery</Text>
          <View style={{ height: 10, backgroundColor: "#1F2230", borderRadius: 9999, overflow: "hidden" }}>
            <View style={{
              width: `${batteryPct ?? 0}%`,
              height: "100%",
              backgroundColor: batteryColor
            }} />
          </View>
          <Text style={{ color: "#B7BECE", fontSize: 12, marginTop: 4 }}>
            {batteryPct == null ? "Unknown" : `${batteryPct}%`} · Updated {formatAgo(data?.latestStatus?.updated_at)}
          </Text>
        </View>
      </View>

      {/* Error */}
      {error ? (
        <Text style={{ color: "#F87171", marginTop: 12 }}>
          {error}
        </Text>
      ) : null}

      {/* Events */}
      <Text style={{ color: "#A7AAB4", fontSize: 12, marginTop: 16, marginBottom: 6 }}>Recent events</Text>
      {data?.recentEvents?.length ? (
        <FlatList
          data={data.recentEvents.slice(0, 3)}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={{
              paddingVertical: 10, paddingHorizontal: 12,
              backgroundColor: "#121423", borderRadius: 12, marginBottom: 8,
              borderWidth: 1, borderColor: "#1E2235"
            }}>
              <Text style={{ color: "#E5E7EB", fontWeight: "600" }}>{item.event}</Text>
              <Text style={{ color: "#9CA3AF", marginTop: 2 }}>{formatDate(item.created_at)}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ color: "#6B7280" }}>No recent events.</Text>
      )}
    </View>
  );
}

// -------- Small date helpers --------
function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
}
function formatAgo(iso?: string) {
  if (!iso) return "just now";
  const t = new Date(iso).getTime();
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
