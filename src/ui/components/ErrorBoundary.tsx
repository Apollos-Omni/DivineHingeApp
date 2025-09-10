// src/ui/components/ErrorBoundary.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";

type Props = React.PropsWithChildren<{}>;
type State = { error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(e: Error) {
    console.error("❌ Uncaught error:", e);
  }

  private reset = () => this.setState({ error: undefined });

  override render() {
    const { error } = this.state;

    if (error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            backgroundColor: "#111",
            gap: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
            Crash captured
          </Text>
          <Text style={{ color: "#bbb", textAlign: "center" }}>
            {error.message}
          </Text>

          <Pressable
            onPress={this.reset}
            style={{
              marginTop: 12,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#444",
            }}
          >
            <Text style={{ color: "#fff" }}>Try again</Text>
          </Pressable>
        </View>
      );
    }

    // No `declare props` needed—TS knows props from the generic
    return this.props.children as React.ReactNode;
  }
}
