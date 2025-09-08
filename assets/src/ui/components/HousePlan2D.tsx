import React, { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Svg, { Polygon, G, Text as SvgText } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedStyle, useFrameCallback } from "react-native-reanimated";
import type { HomeLayout, Room, Door } from "../../types/home";
import DoorGlyph from "./DoorGlyph";

type Props = {
  layout: HomeLayout;
  initialPos?: { x: number; y: number };
  onDoorTap?: (door: Door) => void;
  allowTapToMove?: boolean;
};

export default function HousePlan2D({ layout, initialPos = {x:0.12, y:0.12}, onDoorTap, allowTapToMove = true }: Props) {
  const [size, setSize] = useState({ w: 10, h: 10 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  const px = useSharedValue(initialPos.x);
  const py = useSharedValue(initialPos.y);
  const vx = useSharedValue(0);
  const vy = useSharedValue(0);

  const MAX_SPEED = 0.55, ACCEL = 1.2, FRICTION = 1.8, R = 0.02;

  const targetRef = useRef<{ x: number; y: number; active: boolean }>({ x: px.value, y: py.value, active: false });

  const onTouch = useCallback((nx: number, ny: number) => {
    if (!allowTapToMove) return;
    targetRef.current = { x: nx, y: ny, active: true };
  }, [allowTapToMove]);
  const stopTouch = useCallback(() => { targetRef.current.active = false; }, []);

  const pointInPoly = (p: {x:number;y:number}, poly: {x:number;y:number}[]) => {
    let c = false;
    for (let i=0,j=poly.length-1;i<poly.length;j=i++) {
      const pi = poly[i], pj = poly[j];
      if (((pi.y>p.y) !== (pj.y>p.y)) &&
          (p.x < (pj.x-pi.x)*(p.y-pi.y)/(pj.y-pi.y)+pi.x)) c = !c;
    }
    return c;
  };
  const clampInRooms = (x:number,y:number) => {
    const inside = layout.rooms.some(r => pointInPoly({x,y}, r.polygon));
    if (inside) return {x,y};
    return {x: px.value, y: py.value};
  };

  useFrameCallback((frame) => {
    const dt = Math.min(0.032, frame.timeSincePreviousFrame ? frame.timeSincePreviousFrame/1000 : 0.016);
    let ax = 0, ay = 0;
    if (targetRef.current.active) {
      const dx = targetRef.current.x - px.value;
      const dy = targetRef.current.y - py.value;
      const dist = Math.hypot(dx, dy);
      if (dist > 0.002) {
        const nx = dx / dist, ny = dy / dist, k = Math.min(1, dist / 0.25);
        ax = nx * ACCEL * k; ay = ny * ACCEL * k;
      } else {
        targetRef.current.active = false;
      }
    }
    vx.value += ax * dt; vy.value += ay * dt;

    if (!targetRef.current.active) {
      const s = Math.hypot(vx.value, vy.value);
      if (s > 0) { const d = Math.min(FRICTION * dt, s); vx.value *= (s - d) / s; vy.value *= (s - d) / s; }
    }

    const speed = Math.hypot(vx.value, vy.value);
    if (speed > MAX_SPEED) { const f = MAX_SPEED / speed; vx.value *= f; vy.value *= f; }

    let nx = px.value + vx.value * dt;
    let ny = py.value + vy.value * dt;
    nx = Math.max(0+R, Math.min(1-R, nx));
    ny = Math.max(0+R, Math.min(1-R, ny));

    const clamped = clampInRooms(nx, ny);
    px.value = clamped.x; py.value = clamped.y;
  });

  const N2X = (nx:number) => nx * size.w;
  const N2Y = (ny:number) => ny * size.h;

  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: N2X(px.value - R) }, { translateY: N2Y(py.value - R) }],
  }));

  const doorHit = (door: Door, lx:number, ly:number) => {
    const dx = Math.abs(lx - door.center.x), dy = Math.abs(ly - door.center.y);
    return dx < door.width*0.8 && dy < Math.max(door.thickness*3, 0.02);
  };

  const onSvgPress = (evt:any) => {
    const lx = evt.nativeEvent.locationX / size.w;
    const ly = evt.nativeEvent.locationY / size.h;
    const touched = layout.doors.find(d => doorHit(d, lx, ly));
    if (touched) { onDoorTap?.(touched); return; }
    if (allowTapToMove) onTouch(lx, ly);
  };

  return (
    <View style={{ flex:1 }} onLayout={onLayout}>
      <Svg width="100%" height="100%" onPress={onSvgPress}>
        {layout.rooms.map((r:Room) => (
          <G key={r.id}>
            <Polygon
              points={r.polygon.map(p => `${N2X(p.x)},${N2Y(p.y)}`).join(" ")}
              fill="#12121a" stroke="#2c2c40" strokeWidth={2}
            />
            <SvgText
              x={N2X(r.polygon.reduce((a,p)=>a+p.x,0)/r.polygon.length)}
              y={N2Y(r.polygon.reduce((a,p)=>a+p.y,0)/r.polygon.length)}
              fill="#9ca4b8" fontSize={12} textAnchor="middle"
            >{r.name}</SvgText>
          </G>
        ))}
        {layout.doors.map((d:Door) => (
          <DoorGlyph
            key={d.id}
            cx={N2X(d.center.x)} cy={N2Y(d.center.y)}
            angle={d.angle} width={N2X(d.width)} thickness={N2Y(d.thickness)}
            status={d.status}
          />
        ))}
      </Svg>

      <Animated.View style={[
        { position:"absolute", width: N2X(R*2), height: N2Y(R*2), borderRadius: 999, backgroundColor: "#8b5cf6",
          shadowColor:"#8b5cf6", shadowOpacity:0.45, shadowRadius:14 },
        playerStyle
      ]} />

      <View style={{ position:"absolute", inset:0 }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(e)=>onTouch(e.nativeEvent.locationX/size.w, e.nativeEvent.locationY/size.h)}
        onResponderMove={(e)=>onTouch(e.nativeEvent.locationX/size.w, e.nativeEvent.locationY/size.h)}
        onResponderRelease={stopTouch}
        onResponderTerminate={stopTouch}
      />
    </View>
  );
}
