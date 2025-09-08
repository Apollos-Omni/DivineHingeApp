import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeHallway } from '../screens/HomeHallway';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

const Screen = (title: string) => () => (
  <View style={{ flex: 1, backgroundColor: '#0b0b0f', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: 'white', fontSize: 22, fontWeight: '700' }}>{title}</Text>
  </View>
);

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#0b0b0f' }
};

export const AppNavigator = () => (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#0b0b0f' },
      }}
    >
      <Stack.Screen name='Home' component={HomeHallway} />
      <Stack.Screen name='Locks' component={Screen('Locks')} />
      <Stack.Screen name='Schedules' component={Screen('Schedules')} />
      <Stack.Screen name='Video' component={Screen('Video')} />
    </Stack.Navigator>
  </NavigationContainer>
);
