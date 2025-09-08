import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing } from '../../theme/tokens';

export default function Minimap() {
  return (
    <View style={{ padding: spacing.md, backgroundColor: colors.card, borderRadius: 12 }}>
      <Text style={{ color: colors.muted }}>Minimap placeholder</Text>
    </View>
  );
}


