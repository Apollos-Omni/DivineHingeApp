// Simple sanity check to run with `ts-node` (or compile with tsc)
// Prints the env values that will be resolved at runtime.
console.log("EXPO_PUBLIC_SUPABASE_URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log("EXPO_PUBLIC_SUPABASE_ANON_KEY:", process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? "[present]" : "[missing]");
