// src/ui/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../auth/AuthProvider";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "../../lib/supabaseClient";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const USE_PROXY = true; // Expo Go -> true. Dev client / production -> false.
const redirectTo = AuthSession.makeRedirectUri({
  scheme: "divinehinge",
  useProxy: USE_PROXY,
});

async function oauthSignIn(provider: "google" | "github" | "apple") {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) {
    Alert.alert("OAuth error", error.message);
    return;
  }
  const authUrl = data?.url;
  if (!authUrl) {
    Alert.alert("OAuth error", "No auth URL returned");
    return;
  }
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectTo);
  if (result.type === "success" && result.url) {
    const { error: xErr } = await supabase.auth.exchangeCodeForSession(result.url);
    if (xErr) Alert.alert("OAuth exchange error", xErr.message);
  }
}

async function sendMagicLink(email: string) {
  if (!email) return Alert.alert("Missing email", "Enter your email first.");
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: redirectTo,
    },
  });
  if (error) {
    Alert.alert("Magic Link error", error.message);
    return;
  }
  Alert.alert("Check your email", "Open the link on this device to return to the app.");
}

export default function LoginScreen() {
  const nav = useNavigation<any>();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login"|"register">("login");

  const onSubmit = async () => {
    if (!email || !password) return Alert.alert("Missing info", "Email and password are required.");
    setBusy(true);
    const fn = mode === "login" ? login : register;
    const { error } = await fn(email.trim(), password);
    setBusy(false);
    if (error) Alert.alert("Auth error", error);
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#0b0b0f", justifyContent: "center" }}>
      <Text style={{ fontSize: 28, color: "#f1f3f8", fontWeight: "700", marginBottom: 20 }}>DivineHinge</Text>

      <Text style={{ color: "#b7bece", marginBottom: 6 }}>Email</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ backgroundColor: "#12121a", color: "#f1f3f8", padding: 12, borderRadius: 10 }}
      />

      <Text style={{ color: "#b7bece", marginTop: 14, marginBottom: 6 }}>Password</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ backgroundColor: "#12121a", color: "#f1f3f8", padding: 12, borderRadius: 10 }}
      />

      <TouchableOpacity
        onPress={onSubmit}
        style={{ marginTop: 20, padding: 14, borderRadius: 12, alignItems: "center", backgroundColor: "#8b5cf6" }}
        disabled={busy}
      >
        {busy ? <ActivityIndicator /> : <Text style={{ color: "white", fontWeight: "700" }}>{mode === "login" ? "Sign In" : "Create Account"}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")} style={{ marginTop: 16 }}>
        <Text style={{ color: "#b7bece" }}>
          {mode === "login" ? "No account? Register" : "Have an account? Sign in"}
        </Text>
      </TouchableOpacity>

      {/* Magic Link */}
      <View style={{ marginTop: 24 }}>
        <TouchableOpacity onPress={() => sendMagicLink(email)} style={{ padding: 12, borderRadius: 10, backgroundColor: "#12121a" }}>
          <Text style={{ color: "#f1f3f8", textAlign: "center", fontWeight: "600" }}>Send me a Magic Link</Text>
        </TouchableOpacity>
        <Text style={{ color: "#888", fontSize: 11, marginTop: 8 }}>
          Use the same device to open the link. redirectTo: {redirectTo}
        </Text>
      </View>

      {/* OAuth */}
      <View style={{ marginTop: 28 }}>
        <Text style={{ color: "#b7bece", marginBottom: 8 }}>Or continue with</Text>

        <TouchableOpacity onPress={() => oauthSignIn("google")} style={{ padding: 12, borderRadius: 10, backgroundColor: "#12121a", marginBottom: 10 }}>
          <Text style={{ color: "#f1f3f8", textAlign: "center", fontWeight: "600" }}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => oauthSignIn("github")} style={{ padding: 12, borderRadius: 10, backgroundColor: "#12121a", marginBottom: 10 }}>
          <Text style={{ color: "#f1f3f8", textAlign: "center", fontWeight: "600" }}>Continue with GitHub</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => oauthSignIn("apple")} style={{ padding: 12, borderRadius: 10, backgroundColor: "#12121a" }}>
          <Text style={{ color: "#f1f3f8", textAlign: "center", fontWeight: "600" }}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => nav.navigate("DebugAuth")} style={{ marginTop: 24, alignSelf: "center" }}>
        <Text style={{ color: "#888", fontSize: 12 }}>Open DebugAuth</Text>
      </TouchableOpacity>
    </View>
  );
}
