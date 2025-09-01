import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../ui/screens/LoginScreen';
import { RegisterScreen } from '../ui/screens/RegisterScreen';
import { HomeScreen } from '../ui/screens/HomeScreen';
import { HingeDetailScreen } from '../ui/screens/HingeDetailScreen';
import { AvatarScreen } from '../ui/screens/AvatarScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="HingeDetail" component={HingeDetailScreen} />
        <Stack.Screen name="Avatar" component={AvatarScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
