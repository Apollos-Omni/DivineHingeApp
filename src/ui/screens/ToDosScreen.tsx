// src/screens/TodosScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

type Todo = { id: number; title: string }; // match your table schema

export default function TodosScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('todos').select<'*', Todo>('*');
      if (!isMounted) return;

      if (error) {
        setErr(error.message);
      } else {
        setTodos(data ?? []);
      }
      setLoading(false);
    };

    load();

    // Optional realtime updates
    const channel = supabase
      .channel('public:todos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, (payload) => {
        setTodos((prev) => {
          if (payload.eventType === 'INSERT') return [payload.new as Todo, ...prev];
          if (payload.eventType === 'UPDATE')
            return prev.map((t) => (t.id === (payload.new as any).id ? (payload.new as Todo) : t));
          if (payload.eventType === 'DELETE') return prev.filter((t) => t.id !== (payload.old as any).id);
          return prev;
        });
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (err) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ color: 'crimson', textAlign: 'center' }}>Failed to load todos: {err}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 48, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Todo List</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderColor: '#ddd' }}>
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ opacity: 0.6 }}>No todos yet.</Text>}
      />
    </View>
  );
}
