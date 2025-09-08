import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useAuth } from "../../auth/AuthProvider";
import GradientButton from "../components/common/GradientButton";
// tokens live at src/ui/theme/tokens
import { colors as _colors, radii as _radii } from "../../theme/tokens";

// Safe fallbacks if some tokens are missing
const colors = {
  bg: _colors?.bg ?? "#0b0b0f",
  card: _colors?.card ?? "#16161a",
  border: _colors?.border ?? "#2a2a2a",
  text: _colors?.text ?? "#ffffff",
  muted: _colors?.muted ?? "#9aa0a6",
  accent: _colors?.accent ?? "#22c55e",
  danger: _colors?.danger ?? "#ef4444",
};
const radii = {
  m: _radii?.m ?? 12,
  l: _radii?.l ?? 16,
  xl: _radii?.xl ?? 20,
};

type RowProps = {
  label: string;
  description?: string;
  right?: React.ReactNode;
};
const Row: React.FC<RowProps> = (props: RowProps) => {
  const { label, description, right } = props;
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description ? <Text style={styles.rowDesc}>{description}</Text> : null}
      </View>
      {right}
    </View>
  );
};

const SettingsScreen: React.FC = () => {
  // If your AuthProvider exposes signOut, this will work; otherwise it's a no-op.
  const auth = useAuth() as unknown as { user?: any; signOut?: () => void };

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [haptics, setHaptics] = useState(true);

  const onSignOut = useCallback(() => {
    if (auth?.signOut) auth.signOut();
    else Alert.alert("Sign out", "No auth.signOut() found in provider.");
  }, [auth]);

  const onDeleteAccount = useCallback(() => {
    Alert.alert(
      "Delete account",
      "This action is permanent. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => Alert.alert("Requested", "Account deletion requested.") },
      ],
      { cancelable: true }
    );
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Settings</Text>

      {/* Account */}
      <View style={styles.card}>
        <Text style={styles.section}>Account</Text>
        <Row
          label={auth?.user?.email ?? "Signed in"}
          description={auth?.user ? "Tap Sign Out below to switch accounts." : "Not signed in"}
        />
        <GradientButton title="Sign Out" onPress={onSignOut} />
      </View>

      {/* Preferences */}
      <View style={styles.card}>
        <Text style={styles.section}>Preferences</Text>
        <Row
          label="Notifications"
          description="Receive activity alerts"
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#555", true: colors.accent }}
            />
          }
        />
        <View style={styles.divider} />
        <Row
          label="Biometric unlock"
          description="Use Face/Touch ID where supported"
          right={
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: "#555", true: colors.accent }}
            />
          }
        />
        <View style={styles.divider} />
        <Row
          label="Haptics"
          description="Vibrate on interactions"
          right={
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{ false: "#555", true: colors.accent }}
            />
          }
        />
      </View>

      {/* Danger zone */}
      <View style={[styles.card, { borderColor: colors.danger }]}>
        <Text style={[styles.section, { color: colors.danger }]}>Danger Zone</Text>
        <GradientButton title="Delete Account" onPress={onDeleteAccount} />
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 22, fontWeight: "800", marginBottom: 12 },
  section: { color: colors.text, fontSize: 14, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  rowLabel: { color: colors.text, fontSize: 16, fontWeight: "700" },
  rowDesc: { color: colors.muted, fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
});

export default SettingsScreen;
export { SettingsScreen }; // supports both `import X` and `import { X }`