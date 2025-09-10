// src/components/Account.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { supabase } from '../lib/supabaseClient';

// Derive Session type from your actual client (Supabase v2-safe)
type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];

type Profile = {
  id: string | null;
  user_id: string | null;
  username: string | null;
  website: string | null;
  avatar_url: string | null;
};

// If your Edge Function has a different name or path, update this:
const FUNCTION_URL = 'https://cfqnbsvooirswsevkork.functions.supabase.co/profiles-api';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // We’ll autodetect whether your table links by user_id or id
  const [profileKey, setProfileKey] = useState<'user_id' | 'id'>('user_id');

  // Prevent setState after unmount (RN warns in dev)
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const safeSet = useCallback(<T extends unknown[]>(fn: (...args: T) => void) => {
    return (...args: T) => {
      if (mountedRef.current) fn(...args);
    };
  }, []);
  const safeSetLoading = safeSet(setLoading);
  const safeSetUsername = safeSet(setUsername);
  const safeSetWebsite = safeSet(setWebsite);
  const safeSetAvatarUrl = safeSet(setAvatarUrl);
  const safeSetProfileKey = safeSet(setProfileKey);

  useEffect(() => {
    if (session?.user?.id) {
      getProfileDirect();
    } else {
      // clear fields when session goes null
      safeSetUsername('');
      safeSetWebsite('');
      safeSetAvatarUrl('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const applyRow = useCallback(
    (row: Partial<Profile> | null, key: 'user_id' | 'id' | null) => {
      // Why: keep UI source-of-truth in sync with DB
      safeSetProfileKey(key ?? 'user_id');
      safeSetUsername(row?.username ?? '');
      safeSetWebsite(row?.website ?? '');
      safeSetAvatarUrl(row?.avatar_url ?? '');
    },
    [safeSetAvatarUrl, safeSetProfileKey, safeSetUsername, safeSetWebsite]
  );

  // -------- Direct DB read (works with user_id or id) --------
  async function getProfileDirect() {
    try {
      safeSetLoading(true);
      const uid = session?.user?.id;
      if (!uid) throw new Error('No user on the session');

      // Try user_id first (most common schema)
      let { data, error, status } = await supabase
        .from('profiles')
        .select('id, user_id, username, website, avatar_url')
        .eq('user_id', uid)
        .maybeSingle();

      if (error && status !== 406) throw error;

      if (data) {
        applyRow(data, 'user_id');
        return;
      }

      // Fallback to id = auth.uid() schema
      const alt = await supabase
        .from('profiles')
        .select('id, user_id, username, website, avatar_url')
        .eq('id', uid)
        .maybeSingle();

      if (alt.error && alt.status !== 406) throw alt.error;

      if (alt.data) {
        applyRow(alt.data, 'id');
      } else {
        applyRow(null, 'user_id');
      }
    } catch (err: any) {
      Alert.alert(err?.message ?? String(err));
    } finally {
      safeSetLoading(false);
    }
  }

  // -------- Direct DB upsert (honors detected key) --------
  async function updateProfileDirect() {
    try {
      safeSetLoading(true);
      const uid = session?.user?.id;
      if (!uid) throw new Error('No user on the session');

      const updates: Record<string, any> = {
        [profileKey]: uid, // either user_id or id
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      // Why: ensure return payload so UI reflects actual stored values
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: profileKey })
        .select('id, user_id, username, website, avatar_url')
        .single();

      if (error) throw error;
      applyRow(data as Profile, profileKey);
    } catch (err: any) {
      Alert.alert(err?.message ?? String(err));
    } finally {
      safeSetLoading(false);
    }
  }

  // -------- Edge Function: GET (use fetch; invoke() posts) --------
  async function getMyProfileViaEdge() {
    try {
      safeSetLoading(true);
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error('Not signed in');

      const resp = await fetch(FUNCTION_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', // Why: bypass caches for fresh profile
      });

      const json = (await resp.json()) as { data?: Profile; error?: string };
      if (!resp.ok) throw new Error(json?.error || 'Edge GET failed');

      const row = json?.data ?? null;
      if (row) {
        applyRow(row, 'user_id'); // function should return rows keyed by user_id
      } else {
        applyRow(null, 'user_id');
      }
    } catch (err: any) {
      Alert.alert(err?.message ?? String(err));
    } finally {
      safeSetLoading(false);
    }
  }

  // -------- Edge Function: UPDATE (invoke posts & auto-attaches auth) --------
  async function updateMyProfileViaEdge() {
    try {
      safeSetLoading(true);
      const { data, error } = await supabase.functions.invoke<{ data?: Profile; error?: string }>(
        'profiles-api',
        {
          body: { username, website, avatar_url: avatarUrl },
        }
      );
      if (error) throw error;

      const row = data?.data ?? null;
      if (row) applyRow(row, 'user_id');
    } catch (err: any) {
      Alert.alert(err?.message ?? String(err));
    } finally {
      safeSetLoading(false);
    }
  }

  const handleSignOut = useCallback(async () => {
    try {
      safeSetLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      Alert.alert(err?.message ?? String(err));
    } finally {
      safeSetLoading(false);
    }
  }, [safeSetLoading]);

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email ?? ''} disabled />
      </View>

      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username} onChangeText={setUsername} />
      </View>

      <View style={styles.verticallySpaced}>
        <Input label="Website" value={website} onChangeText={setWebsite} />
      </View>

      {/* Local/direct DB actions */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading…' : 'Update (Direct DB)'}
          onPress={updateProfileDirect}
          disabled={loading}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Reload (Direct DB)" onPress={getProfileDirect} disabled={loading} />
      </View>

      {/* Edge Function actions */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Edge: Get Profile" onPress={getMyProfileViaEdge} disabled={loading} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Edge: Update Profile" onPress={updateMyProfileViaEdge} disabled={loading} />
      </View>

      {/* Sign out */}
      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={handleSignOut} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 40, padding: 12 },
  verticallySpaced: { paddingTop: 4, paddingBottom: 4, alignSelf: 'stretch' },
  mt20: { marginTop: 20 },
});
