// src/components/IdentityManager.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, Alert } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabaseClient";

// Ensure web auth sessions close properly on native
WebBrowser.maybeCompleteAuthSession();

type Identity = {
  id: string;
  user_id: string;
  identity_data?: Record<string, unknown>;
  provider: string; // "google" | "github" | "email" | etc.
  last_sign_in_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function IdentityManager() {
  const [loading, setLoading] = useState(false);
  const [identities, setIdentities] = useState<Identity[]>([]);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.auth.getUserIdentities();
    if (error) {
      Alert.alert("Error loading identities", error.message);
      return;
    }
    setIdentities(data?.identities ?? []);
  }, []);

  useEffect(() => {
    refresh();

    // Refresh identities whenever the auth user updates / session flips
    const { data: sub } = supabase.auth.onAuthStateChange((_event) => {
      // Events can be SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, SIGNED_OUT
      refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  // Choose redirect based on environment (Expo Go vs dev client)
  const redirectTo = Linking.createURL("/auth-callback"); // e.g. divinehingeapp://auth-callback
  // For Expo Go testing, if needed, you can still use:
  // const redirectTo = "https://auth.expo.io/@apollosdesigns/divinehingeapp";

  const linkGoogle = async () => {
    setLoading(true);
    try {
      // User must already be logged in for manual linking
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        Alert.alert("Not signed in", "Log in first, then link Google.");
        return;
      }

      // This triggers the provider flow and will return to your app
      const { data, error } = await supabase.auth.linkIdentity({ provider: "google" });
      if (error) throw error;

      // On native, Supabase will deep-link back.
      // If needed, you can listen for Linking 'url' and call exchangeCodeForSession(url).
      // In most cases, linkIdentity completes and the onAuthStateChange USER_UPDATED/TOKEN_REFRESHED fires.
    } catch (e: any) {
      Alert.alert("Link failed", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  const unlink = async (provider: string) => {
    try {
      if (identities.length < 2) {
        Alert.alert("Hold up", "You can’t unlink your only identity.");
        return;
      }
      const target = identities.find((i) => i.provider === provider);
      if (!target) return;

      const { error } = await supabase.auth.unlinkIdentity(target as any);
      if (error) throw error;
      await refresh();
    } catch (e: any) {
      Alert.alert("Unlink failed", e?.message ?? String(e));
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Linked identities</Text>
      {identities.length === 0 ? (
        <Text>No identities found.</Text>
      ) : (
        identities.map((id) => (
          <View key={id.id} style={{ padding: 8, borderWidth: 1, borderRadius: 8 }}>
            <Text>Provider: {id.provider}</Text>
            <Text>
              Last sign-in: {id.last_sign_in_at ? new Date(id.last_sign_in_at).toLocaleString() : "—"}
            </Text>
            {identities.length > 1 && id.provider !== "email" && (
              <Button title={`Unlink ${id.provider}`} onPress={() => unlink(id.provider)} />
            )}
          </View>
        ))
      )}

      <View style={{ height: 1, backgroundColor: "#333", marginVertical: 8 }} />

      <Button title="Link Google" onPress={linkGoogle} disabled={loading} />
    </View>
  );
}
