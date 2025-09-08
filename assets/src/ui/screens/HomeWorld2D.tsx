import React, { useMemo, useRef, useState } from "react";
import { Alert, View, Text, Pressable } from "react-native";
import HousePlan2D from "../components/HousePlan2D";
import { sampleHome } from "../../data/sampleHome";
import type { Door } from "../../types/home";
import { colors, spacing, radii, shadows } from "../../theme/tokens";
import Minimap from "../features/home/Minimap";
import DoorStatusSheet from "../components/sheets/DoorStatusSheet";
import GradientButton from "../components/common/GradientButton";
import GlassCard from "../components/common/GlassCard";

export default function HomeWorld2D() {
  const [home, setHome] = useState(sampleHome);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeDoor, setActiveDoor] = useState<Door | null>(null);

  // Track player (pull from HousePlan2D via callback if you want true source-of-truth there;
  // for demo UI, we mirror the last position we set)
  const px = useRef(0.12); const py = useRef(0.12);
  const onDoorTap = (door: Door) => {
    setActiveDoor(door); setSheetVisible(true);
  };

  const header = (
    <View style={{ paddingHorizontal:16, paddingTop:16, paddingBottom:8 }}>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>Home Layout</Text>
      <Text style={{ color: colors.subtext }}>Tap doors for status • Press/drag to move</Text>
    </View>
  );

  const hud = (
    <View style={{ position:"absolute", right: 16, top: 16, gap: 12, alignItems: "flex-end" }}>
      <Minimap layout={home} px={px.current} py={py.current} />
      <GlassCard>
        <Text style={{ color: colors.subtext, marginBottom: 6 }}>Quick Actions</Text>
        <GradientButton title="Avatar Builder" onPress={() => { /* TODO: navigation */ }} />
      </GlassCard>
    </View>
  );

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      {header}
      <View style={{ flex:1, margin:12, borderRadius:16, overflow:"hidden", backgroundColor: colors.bg, borderWidth:1, borderColor: colors.line }}>
        <HousePlan2D
          layout={home}
          onDoorTap={onDoorTap}
          initialPos={{x: px.current, y: py.current}}
        />
      </View>
      {hud}

      <DoorStatusSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        doorName={activeDoor?.name}
        status={(activeDoor?.status ?? "locked") as any}
        onToggle={() => {
          if (!activeDoor) return;
          setHome(curr => ({
            ...curr,
            doors: curr.doors.map(d => d.id === activeDoor.id
              ? { ...d, status: d.status === "locked" ? "unlocked" : "locked" }
              : d
            )
          }));
        }}
      />
    </View>
  );
}
