import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { supabase } from '../../lib/supabaseClient';
import { HingeEvent } from '../../types/types';

type RouteParams = { doorId?: string };

export const HingeDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const doorId = (route.params as RouteParams)?.doorId ?? 'door_1';

  const [events, setEvents] = useState<HingeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('hinge_events')
          .select('*')
          .eq('door_id', doorId)
          .order('timestamp', { ascending: false })
          .limit(50);

        if (error) {
          console.warn('[hinge_events] detail load error:', error);
          setEvents([]);
        } else {
          setEvents((data ?? []) as HingeEvent[]);
        }
      } catch (e) {
        console.warn('HingeDetailScreen load failed:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [doorId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Door: {doorId}</Text>
      <FlatList
        data={events}
        keyExtractor={(i, idx) => (i?.id != null ? String(i.id) : `idx-${idx}`)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.line}>
              {(item.action || 'event').toUpperCase()} • {new Date(item.timestamp as any).toLocaleString()}
            </Text>
            {!!item.status && <Text style={styles.sub}>Status: {item.status}</Text>}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<Text style={styles.sub}>No events.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0f', padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  card: { backgroundColor: '#16161a', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  line: { color: '#fff', fontWeight: '700' },
  sub: { color: '#cfcfcf' },
});

export default HingeDetailScreen;
