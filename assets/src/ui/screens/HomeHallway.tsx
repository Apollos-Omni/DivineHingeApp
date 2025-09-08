import React from 'react';
import { View, Image, Text, ScrollView } from 'react-native';
import { colors, spacing } from '../../theme/tokens';
export default function HomeHallway() {
  return (
    <ScrollView style={{ flex:1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing.md }}>Hallway</Text>
      <View style={{ flexDirection:'row', columnGap: spacing.md }}>
        <Image source={require('../assets/doors/door1.jpg')} style={{ width: 120, height: 180, borderRadius: 12 }} />
        <Image source={require('../assets/doors/B0.png')} style={{ width: 120, height: 180, borderRadius: 12 }} />
      </View>
    </ScrollView>
  );
}


