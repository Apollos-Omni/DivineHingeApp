import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  onTarget?: (x: number, y: number) => void;  // screen-space coords
  onEnd?: () => void;
  children?: React.ReactNode;
};

export default function TouchMoveSurface({ onTarget, onEnd, children }: Props) {
  // Pan gesture gives us continuous finger position; tap also triggers pan begin
  const pan = useMemo(() =>
    Gesture.Pan()
      .onBegin(e => { onTarget?.(e.absoluteX, e.absoluteY); })
      .onChange(e => { onTarget?.(e.absoluteX, e.absoluteY); })
      .onEnd(() => { onEnd?.(); })
      .onFinalize(() => { onEnd?.(); })
  , [onTarget, onEnd]);

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>{children}</View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
