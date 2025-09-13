// App.tsx
import "react-native-url-polyfill/auto";
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";

import ErrorBoundary from "./src/ui/components/ErrorBoundary";
import { AuthProvider, useAuth } from "./src/auth/AuthProvider";
import AppNavigator from "./src/navigation/AppNavigator";

import Auth from "./src/components/Auth";

// Optional: configure linking (not strictly needed for proxy flow)
Linking.createURL("/");

const Gate: React.FC = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <AppNavigator /> : <Auth />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <Gate />
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
