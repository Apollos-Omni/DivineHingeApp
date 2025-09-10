// App.tsx
import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import ErrorBoundary from './src/ui/components/ErrorBoundary';
import { AuthProvider } from './src/auth/AuthProvider';
import AppNavigator from './src/navigation/AppNavigator';

import Account from './src/components/Account';
import Auth from './src/components/Auth';
import { supabase } from './src/lib/supabaseClient';

// --- Use the v2 Session type without Awaited ---
import type { Session } from '@supabase/supabase-js';
import { HomeScreen } from './src/ui/screens/HomeScreen';
import LoginScreen from './src/ui/screens/LoginScreen';

// Optional: configure linking (not strictly needed for proxy flow)
Linking.createURL('/');

function Gate() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return user ? <HomeScreen /> : <LoginScreen />;
}


export let currentSession: Session | null = null;

const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;

    // Initial session (v2)
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      if (!active) return;
      const s = data?.session ?? null;
      setSession(s);
      currentSession = s;
      setBooting(false);
    });

    // Subscribe to auth state changes (v2)
    const { data: authSub } = supabase.auth.onAuthStateChange((_event: any, newSession: null) => {
      if (!active) return;
      setSession(newSession ?? null);
      currentSession = newSession ?? null;
    });

    return () => {
      active = false;
      authSub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        {!session || !session.user ? (
          <Auth />
        ) : (
          <>
            {/* Removed key=… to avoid the prop type error */}
            <Account session={session} />
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </>
        )}
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;

function useAuth(): { loading: any; user: any; } {
throw new Error('Function not implemented.');
}
