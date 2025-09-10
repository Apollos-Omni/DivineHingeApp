import { supabase } from '../lib/supabaseClient';

/**
 * Example: call profiles-api via supabase.functions.invoke
 */
export async function getProfile() {
  return supabase.functions.invoke('profiles-api', { method: 'GET' });
}

export async function updateProfile(data: { username: string; website?: string; avatar_url?: string }) {
  return supabase.functions.invoke('profiles-api', { method: 'POST', body: data });
}

/**
 * Example: call via fetch with explicit headers
 */
export async function getProfileFetch() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const resp = await fetch('https://cfqnbsvooirswsevkork.functions.supabase.co/profiles-api', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.SUPABASE_ANON_KEY!,
      'Content-Type': 'application/json',
    },
  });
  return resp.json();
}
