import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAvatarState } from '../../state/avatarState';

export const AvatarScreen: React.FC = () => {
  const avatar = useAvatarState((state: { avatar: any }) => state.avatar);

  if (!avatar) return <Text style={styles.empty}>No avatar loaded.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Divine Avatar</Text>
      <Text style={styles.stat}>Level: {avatar.level}</Text>
      <Text style={styles.stat}>Experience: {avatar.experience}</Text>
      <Text style={styles.stat}>Karma: {avatar.karma}</Text>

      <Text style={styles.subtitle}>Upgrades Unlocked</Text>
      {avatar.upgrades.length === 0 && <Text>You have no upgrades yet.</Text>}
      <FlatList
        data={avatar.upgrades}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.upgradeItem}>{item}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#121212' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#7FFF00', marginBottom: 24 },
  stat: { color: '#CCC', fontSize: 20, marginBottom: 8 },
  subtitle: { fontSize: 22, fontWeight: '600', color: '#AAA', marginTop: 20, marginBottom: 12 },
  upgradeItem: { color: '#7FFF00', fontSize: 18, marginBottom: 6 },
  empty: { flex: 1, color: '#777', textAlign: 'center', marginTop: 40, fontSize: 18 },
});
// Placeholder for AvatarScreen.tsx
