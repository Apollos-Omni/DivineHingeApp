// App.tsx
import "react-native-url-polyfill/auto";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import ErrorBoundary from "./src/ui/components/ErrorBoundary";
import { AuthProvider, useAuth } from "./src/auth/AuthProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import Auth from "./src/components/Auth";
// import { initLogRocket, identifyUser } from "./src/observability/logrocket";

const Gate: React.FC = () => {
  const { loading, user } = useAuth();

  // useEffect(() => { initLogRocket(); }, []);
  // useEffect(() => { if (user) identifyUser(user as any); }, [user]);

  if (loading) return null;
  return user ? <AppNavigator /> : <Auth />;
};

const App: React.FC = () => (
  <ErrorBoundary>
    <AuthProvider>
      <NavigationContainer>
        <Gate />
      </NavigationContainer>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
