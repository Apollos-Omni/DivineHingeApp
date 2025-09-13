// src/ui/screens/DoorHubScreen.tsx
import React, { useState, useCallback } from "react";
import { FlatList, View, Text, Pressable } from "react-native";
import DoorStatusSheet from "../components/sheets/DoorStatusSheet";
import * as Haptics from "expo-haptics";
// import { supabase } from "../../lib/supabaseClient"; // when you’re ready to call your RPC

type DoorCard = {
  id: string;
  name: string;
  status: "locked" | "unlocked" | "ajar";
};

const MOCK: DoorCard[] = [
  { id: "A1", name: "Front", status: "locked" },
  { id: "B2", name: "Garage", status: "ajar" },
  { id: "C3", name: "Patio", status: "unlocked" },
];

export function DoorHubScreen() {
  const [doors, setDoors] = useState(MOCK);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [active, setActive] = useState<DoorCard | null>(null);
  const [busy, setBusy] = useState(false);

  const open = (d: DoorCard) => {
    setActive(d);
    setSheetOpen(true);
  };
  const close = () => setSheetOpen(false);

  const updateDoor = (id: string, status: DoorCard["status"]) =>
    setDoors((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));

  // Replace these with real calls (RPC or table update) when ready
  const doAction = useCallback(
    async (kind: "lock" | "unlock" | "toggle") => {
      if (!active) return;
      setBusy(true);
      try {
        // Example shape for later:
        // const { error } = await supabase.rpc("hinge_do_action", { door_id: active.id, action: kind });
        // if (error) throw error;
        await new Promise((r) => setTimeout(r, 650)); // simulate network
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const next =
          kind === "toggle"
            ? active.status === "locked"
              ? "unlocked"
              : "locked"
            : kind === "lock"
              ? "locked"
              : "unlocked";

        updateDoor(active.id, next as DoorCard["status"]);
        setActive((a) =>
          a ? { ...a, status: next as DoorCard["status"] } : a,
        );
      } finally {
        setBusy(false);
      }
    },
    [active],
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: "800",
          marginBottom: 12,
        }}
      >
        Door Hub
      </Text>

      <FlatList
        data={doors}
        keyExtractor={(d) => d.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => open(item)}
            style={{
              backgroundColor: "#12121a",
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: "#2c2c40",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#f1f3f8", fontWeight: "700" }}>
                {item.name}
              </Text>
              <StatusChip status={item.status} />
            </View>
            <Text style={{ color: "#b7bece", marginTop: 6 }}>#{item.id}</Text>
          </Pressable>
        )}
      />

      <DoorStatusSheet
        visible={sheetOpen}
        onClose={close}
        doorId={active?.id}
        doorName={active?.name}
        status={active?.status}
        busy={busy}
        onLock={() => doAction("lock")}
        onUnlock={() => doAction("unlock")}
        onToggle={() => doAction("toggle")}
        speakFeedback
      />
    </View>
  );
}

function StatusChip({ status }: { status: "locked" | "unlocked" | "ajar" }) {
  const color =
    status === "locked"
      ? "#ef4444"
      : status === "unlocked"
        ? "#22c55e"
        : "#f59e0b";
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: color + "22",
        borderWidth: 1,
        borderColor: color,
      }}
    >
      <Text style={{ color, fontWeight: "700", fontSize: 12 }}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}
