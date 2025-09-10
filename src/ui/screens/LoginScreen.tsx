// /src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, Button, TextInput, ActivityIndicator, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabaseClient";

// Finish pending browser sessions (iOS/Android)
WebBrowser.maybeCompleteAuthSession();

// Hardcode the Snack redirect to avoid type mismatches.
const redirectTo = "https://auth.expo.io/@apollosdesigns/divinehingeapp";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setBusy(true);
      const authAny = (supabase as any).auth;

      if (typeof authAny.signInWithOAuth === "function") {
        // Supabase JS v2
        const { error } = await authAny.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        });
        if (error) throw error;
      } else {
        // Supabase JS v1
        const { error } = await authAny.signIn(
          { provider: "google" },
          { redirectTo }
        );
        if (error) throw error;
      }
    } catch (e: any) {
      Alert.alert("Google Sign-In Error", e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  const signInWithMagicLink = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Enter your email to receive a sign-in link.");
      return;
    }
    try {
      setBusy(true);
      const authAny = (supabase as any).auth;

      if (typeof authAny.signInWithOtp === "function") {
        // Supabase JS v2
        const { error } = await authAny.signInWithOtp({
          email: email.trim(),
          options: { emailRedirectTo: redirectTo },
        });
        if (error) throw error;
      } else {
        // Supabase JS v1
        // v1 takes options as the second argument
        const { error } = await authAny.signIn(
          { email: email.trim() },
          { redirectTo }
        );
        if (error) throw error;
      }

      Alert.alert("Check your email", "We sent you a login link.");
    } catch (e: any) {
      Alert.alert("Magic Link Error", e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ padding: 20, gap: 16, marginTop: 60 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>DivineHingeApp Login</Text>

      <Button title="Continue with Google" onPress={signInWithGoogle} disabled={busy} />

      <View style={{ height: 1, backgroundColor: "#ddd", marginVertical: 12 }} />

      <Text style={{ fontWeight: "500" }}>Or use a magic link:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderColor: "#bbb", borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <Button title="Send magic link" onPress={signInWithMagicLink} disabled={busy} />

      {busy && (
        <View style={{ marginTop: 16 }}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}
