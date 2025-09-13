import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";

const FN_URL = `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/hello-world`;
const ANON   = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export default function FunctionTestScreen() {
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string>("");

  const ping = async () => {
    try {
      setLoading(true);
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON,
          Authorization: `Bearer ${ANON}`, // for verify_jwt=true
        },
        body: JSON.stringify({ name: "Apollos" }),
      });

      const text = await res.text(); // your function may return JSON or text
      setOut(text);
      console.log("Fn reply:", text);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
    } catch (e: any) {
      setOut(e.message ?? String(e));
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0f", padding: 16, justifyContent: "center" }}>
      <Pressable
        onPress={ping}
        style={{ backgroundColor: "#8b5cf6", padding: 16, borderRadius: 14, alignItems: "center" }}
      >
        {loading ? <ActivityIndicator /> : <Text style={{ color: "white", fontSize: 16 }}>Ping hello-world</Text>}
      </Pressable>

      <Text style={{ color: "#b7bece", marginTop: 16 }} selectable>
        {out || "Tap the button to call your function."}
      </Text>
    </View>
  );
}
