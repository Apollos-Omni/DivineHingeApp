// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/AuthProvider';

import { DoorHubScreen } from '../ui/screens/DoorHubScreen';
import { HomeScreen } from '../ui/screens/HomeScreen';
import { SchedulesScreen } from '../ui/screens/SchedulesScreen';
import { ActivityScreen } from '../ui/screens/ActivityScreen';
import { RecordingSettingsScreen } from '../ui/screens/RecordingSettingsScreen';
import { DoorsGalleryScreen } from '../ui/screens/DoorsGalleryScreen';
import RenameDeviceScreen from '../ui/screens/RenameDeviceScreen';
import { SelectBackground } from '../ui/screens/SelectBackground';
import { HomeHallway } from '../ui/screens/HomeHallway';
import HallwayHomeScreen from '../ui/screens/HallwayHomeScreen';
import GameMode from '../ui/screens/GameMode';
import { LoginScreen } from '../ui/screens/LoginScreen';
import RegisterScreen from '../ui/screens/RegisterScreen';
import HingeDetailScreen from '../ui/screens/HingeDetailScreen';
import { AvatarScreen } from '../ui/screens/AvatarScreen';
import SettingsScreen from '../ui/screens/SettingsScreen';
import { DevicesScreen } from '../ui/screens/DevicesScreen';
import HomeWorld2D from '../ui/screens/HomeWorld2D';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack.Navigator
      key={user ? 'app' : 'auth'}           // <- important
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? 'Home' : 'Login'}
    >
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DoorHub" component={DoorHubScreen} options={{ headerShown: true, title: 'Door' }} />
          <Stack.Screen name="Devices" component={DevicesScreen} options={{ headerShown: true, title: 'Devices' }} />
          <Stack.Screen name="RenameDevice" component={RenameDeviceScreen} options={{ headerShown: true, title: 'Rename Device' }} />
          <Stack.Screen name="DoorsGallery" component={DoorsGalleryScreen} options={{ headerShown: true, title: 'Doors Gallery' }} />
          <Stack.Screen name="RecordingSettings" component={RecordingSettingsScreen} options={{ headerShown: true, title: 'Recording' }} />
          <Stack.Screen name="Schedules" component={SchedulesScreen} options={{ headerShown: true, title: 'Schedules' }} />
          <Stack.Screen name="Activity" component={ActivityScreen} options={{ headerShown: true, title: 'Activity' }} />
          <Stack.Screen name="HingeDetail" component={HingeDetailScreen} />
          <Stack.Screen name="Avatar" component={AvatarScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="HomeWorld" component={HomeWorld2D} />
          <Stack.Screen name="GameMode" component={GameMode} />
          <Stack.Screen name="HomeHallway" component={HomeHallway} />
          <Stack.Screen name="HallwayHomeScreen" component={HallwayHomeScreen} />
          <Stack.Screen name="SelectBackground" component={SelectBackground} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
