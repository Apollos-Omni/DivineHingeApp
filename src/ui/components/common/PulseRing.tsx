import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlassCard from '../common/GlassCard';
import GradientButton from '../common/GradientButton';
import { tokens } from '../../../theme/tokens';
type Props = { name: string; status: 'locked' | 'unlocked' | 'ajar'; onToggle?: () => void; onOpen?: () => void; };
export default function DoorCard({ name, status, onToggle, onOpen }: Props) {
  const color = status === 'locked' ? '#ef4444' : status === 'unlocked' ? '#22c55e' : '#f59e0b';
  return (
    <GlassCard style={styles.card}>
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.sub}>{status.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={onToggle} style={styles.smallBtn}>
          <Text style={styles.smallTxt}>{status === 'locked' ? 'Unlock' : 'Lock'}</Text>
        </TouchableOpacity>
        <GradientButton title='Open' onPress={onOpen} style={{ marginTop: 8 }} />
      </View>
    </GlassCard>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  title: { color: tokens.colors.text, fontWeight: '900', fontSize: 16 },
  sub: { color: tokens.colors.textSub, marginTop: 2 },
  right: { marginLeft: 12, minWidth: 120 },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: tokens.radius.md, backgroundColor: tokens.colors.surfaceAlt, alignItems: 'center' },
  smallTxt: { color: tokens.colors.text, fontWeight: '800' },
});