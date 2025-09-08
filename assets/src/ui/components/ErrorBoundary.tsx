import React from 'react';
import { ScrollView, Text } from 'react-native';
export class ErrorBoundary extends React.Component<{}, { error?: Error }> {
  constructor(props: {}) { super(props); this.state = {}; }
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children as any;
    return (
      <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#111827' }}>
        <Text style={{ color: '#f87171', fontSize: 18, fontWeight: 'bold' }}>Oops — a screen crashed</Text>
        <Text style={{ color: '#fff', marginTop: 8 }}>{String(this.state.error.stack || this.state.error.message)}</Text>
      </ScrollView>
    );
  }
}


