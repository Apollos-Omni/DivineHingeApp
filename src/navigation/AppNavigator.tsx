// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../auth/AuthProvider";

// Screens
import { HomeScreen } from "../ui/screens/HomeScreen";
import LoginScreen from "../ui/screens/LoginScreen";
import RegisterScreen from "../ui/screens/RegisterScreen";
import TodosScreen from '../ui/screens/ToDosScreen';
import { DoorHubScreen } from "../ui/screens/DoorHubScreen";
import HingeDetailScreen from "../ui/screens/HingeDetailScreen";
import HallwayHomeScreen from "../ui/screens/HallwayHomeScreen";
import { HomeHallway } from "../ui/screens/HomeHallway";
import { ActivityScreen } from "../ui/screens/ActivityScreen";
import { RecordingSettingsScreen } from "../ui/screens/RecordingSettingsScreen";
import DebugAuth from "../ui/screens/DebugAuth";

type RootStackParamList = {
  // auth
  Login: undefined;
  Register: undefined;
  // debug
  DebugAuth: undefined;
  // app
  Home: undefined;
  DoorHub: undefined;
  HingeDetail: { id?: string } | undefined;
  HallwayHome: undefined;
  HomeHallway: undefined;
  Activity: undefined;
  RecordingSettings: undefined;
  Todos: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DoorHub" component={DoorHubScreen} />
      <Stack.Screen name="HingeDetail" component={HingeDetailScreen} />
      <Stack.Screen name="HallwayHome" component={HallwayHomeScreen} />
      <Stack.Screen name="Todos" component={TodosScreen} />
      <Stack.Screen name="HomeHallway" component={HomeHallway} />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="RecordingSettings" component={RecordingSettingsScreen} />
      <Stack.Screen name="DebugAuth" component={DebugAuth} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="DebugAuth" component={DebugAuth} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <AppStack /> : <AuthStack />;
}
