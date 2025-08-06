import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { AppNavigator } from './navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
// Placeholder for App.tsx
