// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import  ErrorBoundary  from './src/ui/components/ErrorBoundary';
import { AuthProvider } from './src/auth/AuthProvider';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ErrorBoundary children={undefined}>
      <AuthProvider children={undefined}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}
