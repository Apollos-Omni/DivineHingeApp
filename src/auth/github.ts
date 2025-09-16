import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { supabase } from "../lib/supabaseClient";

WebBrowser.maybeCompleteAuthSession(); // required on web, harmless elsewhere
// docs: https://docs.expo.dev/versions/latest/sdk/webbrowser/

const redirectTo = AuthSession.makeRedirectUri({
  scheme: "divinehinge",
  path: "auth/callback",
});

async function handleRedirectUrl(url: string) {
  const { queryParams } = Linking.parse(url);
  const authCode = String(queryParams?.code ?? "");
  if (!authCode) throw new Error("No auth code in redirect URL");
  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);
  if (error) throw error;
  return data.session;
}

export async function signInWithGitHub() {
  // Ask Supabase for the provider URL without auto-redirect
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;

  const authUrl = data?.url;
  if (!authUrl) throw new Error("No auth URL from Supabase");

  if (Platform.OS === "ios" || Platform.OS === "android") {
    const res = await WebBrowser.openAuthSessionAsync(authUrl, redirectTo);
    if (res.type !== "success" || !res.url) throw new Error("Auth cancelled or failed");
    return handleRedirectUrl(res.url);
  }

  // Web fallback (no 'window' reference)
  await Linking.openURL(authUrl);
  return null; // navigation occurs
}
