// src/lib/supabaseClient.ts
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cfqnbsvooirswsevkork.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcW5ic3Zvb2lyc3dzZXZrb3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjQxOTgsImV4cCI6MjA2NTUwMDE5OH0.-cmrhbw5Su7VFHz5QOzQ9ukFtcDAJCSlZHvGROWW19w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // RN apps don't use URL hash
  },
});
