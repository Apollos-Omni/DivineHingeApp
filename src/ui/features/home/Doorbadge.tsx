import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../../theme/tokens";

export default function DoorBadge({ x, y, status }: { x:number; y:number; status:"locked"|"unlocked"|"ajar" }) {
  const c = status==="locked" ? colors.danger : status==="unlocked" ? colors.success : colors.warn;
  return (
    <View style={{ position:"absolute", left:x-12, top:y-26, paddingHorizontal:8, paddingVertical:4, borderRadius:12, backgroundColor:"#0f0f16", borderWidth:1, borderColor:"#212133" }}>
      <Text style={{ color:c, fontWeight:"800", fontSize:10, letterSpacing:0.3 }}>{status.toUpperCase()}</Text>
    </View>
  );
}
