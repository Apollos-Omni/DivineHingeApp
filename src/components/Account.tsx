// src/components/Account.tsx
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import { supabase } from "../lib/supabaseClient";
import IdentityManager from "./IdentityManager";

type Profile = {
  id: string | null;
  username: string | null;
  website: string | null;
  avatar_url: string | null;
};

export default function Account() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: null,
    username: "",
    website: "",
    avatar_url: null,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        if (!user) return;
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, website, avatar_url")
          .eq("id", user.id)
          .single();
        if (error) throw error;
        setProfile({
          id: data.id,
          username: data.username,
          website: data.website,
          avatar_url: data.avatar_url,
        });
      } catch (e: any) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");
      const updates = {
        id: user.id,
        username: profile.username,
        website: profile.website,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      Alert.alert("Saved", "Profile updated.");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Username"
        value={profile.username ?? ""}
        onChangeText={(t) => setProfile((p) => ({ ...p, username: t }))}
      />
      <Input
        label="Website"
        value={profile.website ?? ""}
        onChangeText={(t) => setProfile((p) => ({ ...p, website: t }))}
      />
      <Button title={loading ? "Saving..." : "Save"} onPress={updateProfile} disabled={loading} />

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <IdentityManager />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, padding: 12 },
  verticallySpaced: { paddingTop: 4, paddingBottom: 4, alignSelf: "stretch" },
  mt20: { marginTop: 20 },
});
