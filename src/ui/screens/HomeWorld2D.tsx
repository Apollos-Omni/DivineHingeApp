import React, { useState, useMemo } from "react";
import { View } from "react-native";
import { T } from "../../theme/ui";
import HousePlan2D from "../components/HousePlan2D";
import { sampleHome } from "../../data/sampleHome";
import type { Door } from "../../types/home";
import { colors } from "../../theme/tokens";
import Minimap from "../features/home/Minimap";
import DoorStatusSheet from "../components/sheets/DoorStatusSheet";
import Backdrop from "../components/Surfaces/Backdrop";
import Character from "../features/home/Character";
import DoorBadge from "../features/home/Doorbadge";

export default function HomeWorld2D() {
  const [home, setHome] = useState(sampleHome);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeDoor, setActiveDoor] = useState<Door | null>(null);

  // keep these in sync with HousePlan2D via a callback (we’ll add it)
  const [playerPx, setPlayerPx] = useState({ x: 0, y: 0, r: 10, width: 0, height: 0 });

  const onDoorTap = (door: Door) => { setActiveDoor(door); setSheetVisible(true); };

  return (
    <View style={{ flex:1, backgroundColor: colors.bg }}>
      <Backdrop />
      <View style={{ paddingHorizontal:16, paddingTop:16, paddingBottom:8 }}>
        <T variant="title">Home Layout</T>
        <T variant="subtitle">Tap doors for status • Press / drag anywhere to move</T>
      </View>

      <View style={{ flex:1, margin:12, borderRadius:16, overflow:"hidden", backgroundColor:"transparent", borderWidth:1, borderColor:"#222238" }}>
        <HousePlan2D
          layout={home}
          onDoorTap={onDoorTap}
          // New: receive pixels so we can render premium overlays
          onPixelPositionChange={setPlayerPx}
        />
        {/* Premium overlays */}
        <Character x={playerPx.x} y={playerPx.y} r={Math.max(10, playerPx.r)} />
        {home.doors.map(d => (
          <DoorBadge
            key={d.id}
            x={playerPx.width ? d.center.x * playerPx.width : 0}
            y={playerPx.height ? d.center.y * playerPx.height : 0}
            status={d.status as any}
          />
        ))}
      </View>

      {/* Minimap */}
      <View style={{ position:"absolute", right:16, top:16 }}>
        <Minimap layout={home} px={(playerPx.width? playerPx.x/playerPx.width : 0)} py={(playerPx.height? playerPx.y/playerPx.height : 0)} />
      </View>

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
