// src/ui/screens/DebugAuth.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../auth/AuthProvider";

function JsonBlock({ title, data }: { title: string; data: any }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: "#b7bece", fontWeight: "700", marginBottom: 6 }}>{title}</Text>
      <ScrollView style={{ maxHeight: 220, backgroundColor: "#12121a", padding: 10, borderRadius: 10 }}>
        <Text style={{ color: "#f1f3f8", fontSize: 12 }}>{JSON.stringify(data, null, 2)}</Text>
      </ScrollView>
    </View>
  );
}

export default function DebugAuth() {
  const { user, session, logout } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0f", padding: 16 }}>
      <Text style={{ color: "#f1f3f8", fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Auth Debug</Text>
      <JsonBlock title="user" data={user} />
      <JsonBlock title="session" data={session} />

      <TouchableOpacity onPress={logout} style={{ padding: 14, backgroundColor: "#ef4444", borderRadius: 10 }}>
        <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
