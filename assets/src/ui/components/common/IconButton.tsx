import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

type Props = { label?: string; onPress?: () => void; style?: ViewStyle | ViewStyle[]; };

export default function IconButton({ label='★', onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[{ backgroundColor: colors.card, padding: spacing.md, borderRadius: radii.md, alignItems: 'center', justifyContent:'center' }, style as any]}>
      <Text style={{ color: colors.text, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}


