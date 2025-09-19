WARP Auth Flow Fix Patch
========================

Replaces auth/navigation files to fix "stuck on login" by ensuring:
- Single source of truth for auth state via AuthProvider (Supabase).
- Initial `getSession()` + `onAuthStateChange` subscription.
- No double-gating: App.tsx renders <AppNavigator/>; AppNavigator switches stacks based on `user`.
- LoginScreen uses `useAuth().login` and relies on auth state to transition.

Files included (overwrite these in your project root):
- App.tsx
- src/auth/AuthProvider.tsx
- src/navigation/AppNavigator.tsx
- src/ui/screens/LoginScreen.tsx

Checklist after applying:
1) Ensure `.env` defines EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.
2) In `src/lib/supabaseClient.ts`, `detectSessionInUrl: false` and AsyncStorage storage are set (already in repo).
3) Remove any direct usage of `src/components/Auth.tsx` from App.tsx (no longer needed).
4) Run: `npx expo-doctor --fix`, then `npm i`, then `npx expo start`.
5) Try email/password sign-in; on success you should be navigated to Home automatically.

