import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

type Props = { title: string; onPress?: () => void; disabled?: boolean; style?: ViewStyle | ViewStyle[]; };

export default function GradientButton({ title, onPress, disabled, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[{ backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radii.lg, alignItems: 'center', opacity: disabled ? 0.6 : 1 }, style as any]}
    >
      <Text style={{ color: '#0b0b0b', fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}


