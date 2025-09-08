// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const SUPABASE_URL = 'https://cfqnbsvooirswsevkork.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInJlZiI6ImNmcW5ic3Zvb2lyc3dzZXZrb3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjQxOTgsImV4cCI6MjA2NTUwMDE5OH0.-cmrhbw5Su7VFHz5QOzQ9ukFtcDAJCSlZHvGROWW19w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
