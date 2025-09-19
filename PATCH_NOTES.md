# Patch Notes (Auth + Navigator + Debug)

This patch replaces the auth flow with a single, stable source of truth and adds a DebugAuth screen.

**Replaced files**
- App.tsx
- src/auth/AuthProvider.tsx
- src/navigation/AppNavigator.tsx
- src/ui/screens/LoginScreen.tsx

**Added files**
- src/ui/screens/DebugAuth.tsx
- src/components/IdentityManager.tsx (stub)
- src/ui/components/VirtualJoystick.tsx (stub to satisfy GameMode import)
- src/types/env.d.ts

**What changed**
- AuthProvider now initializes session on mount and subscribes to changes.
- AppNavigator gates between AuthStack and AppStack using `useAuth().user`.
- LoginScreen calls `login`/`register` directly; on success the navigator flips automatically.
- Account.tsx rewritten to a minimal, compiling profile editor (uses `profiles` table).
- DebugAuth shows live `user` and `session` plus a Sign out button.

**Next steps**
- Ensure Supabase Auth has Email/Password enabled and you create a test user.
- Remove any direct dependency on `expo-modules-core` if `expo-doctor` warns:
  - `npm remove expo-modules-core && npx expo install expo`
- Use Node 20.19.x (nvm-windows recommended).
- Start the app: `npx expo start` (or `eas build --profile development --platform android`).

