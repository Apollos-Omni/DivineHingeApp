import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  avatarUrl?: string;
  karmaLevel: number;
  displayName: string;
}

export const AvatarBadge: React.FC<Props> = ({ avatarUrl, karmaLevel, displayName }) => {
  const auraColor = karmaLevel > 100 ? '#7FFF00' : karmaLevel > 50 ? '#FFD700' : '#AAA';

  return (
    <View style={styles.container}>
      <Image
        source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/icons/default-avatar.png')}
        style={[styles.avatar, { borderColor: auraColor }]}
      />
      <Text style={styles.name}>{displayName}</Text>
      <View style={[styles.aura, { backgroundColor: auraColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', margin: 8 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
  },
  name: { marginTop: 4, fontWeight: 'bold', color: '#FFF' },
  aura: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.3,
    top: -8,
    left: -8,
  },
});
// Placeholder for AvatarBadge.tsx
