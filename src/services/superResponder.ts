// src/services/superResponder.ts
import { supabase } from "../lib/supabaseClient";

export async function callSuperResponder(input: string) {
  // If your function should be private, uncomment the token lines below
  // const { data: { session } } = await supabase.auth.getSession();
  // const token = session?.access_token;

  const res = await fetch(
    (process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL || `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1`)+"/super-responder",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${token}`,
        // 'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!, // only if you want to send anon key
      },
      body: JSON.stringify({ message: input }),
    },
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
