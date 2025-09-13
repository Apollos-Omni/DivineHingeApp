// src/lib/supabaseClient.ts
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from "../types/database";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Mobile apps don't have a URL hash to parse like the web:
    detectSessionInUrl: false,
    storage: {
      getItem: (key: any) => AsyncStorage.getItem(key),
      setItem: (key: any, value: any) => AsyncStorage.setItem(key, value),
      removeItem: (key: any) => AsyncStorage.removeItem(key),
    },
    // Optional: use a custom storage key: any to avoid clashes across apps
    // storageKey: 'sb-divinehinge-auth',
  },
});
