// Place this at: src/types/env.d.ts   (or types/env.d.ts and include it in tsconfig "include")
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}
