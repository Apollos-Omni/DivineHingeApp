// src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../auth/AuthProvider";

// ✅ Only import screens that exist in your repo
import { HomeScreen } from "../ui/screens/HomeScreen";
import LoginScreen from "../ui/screens/LoginScreen";
import RegisterScreen from "../ui/screens/RegisterScreen";
import { DoorHubScreen } from "../ui/screens/DoorHubScreen";
import HingeDetailScreen from "../ui/screens/HingeDetailScreen";
import HallwayHomeScreen from "../ui/screens/HallwayHomeScreen";
import { HomeHallway } from "../ui/screens/HomeHallway";
import { ActivityScreen } from "../ui/screens/ActivityScreen";
import { RecordingSettingsScreen } from "../ui/screens/RecordingSettingsScreen";
import { DoorsGalleryScreen } from "../ui/screens/DoorsGalleryScreen";
import RenameDeviceScreen from "../ui/screens/RenameDeviceScreen";
import SuperResponderScreen from "../ui/screens/SuperResponderScreen";
import FunctionTestScreen from '../ui/screens/FunctionTestScreen';

type RootStackParamList = {
  // auth
  Login: undefined;
  Register: undefined;
  // app
  Home: undefined;
  DoorHub: undefined;
  HingeDetail: { id?: string } | undefined;
  HallwayHome: undefined;
  HomeHallway: undefined;
  Activity: undefined;
  RenameDevice: undefined;
  SuperResponder: undefined;
  FunctionTest: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoorHub"
        component={DoorHubScreen}
        options={{ title: "Door Hub" }}
      />
      <Stack.Screen
        name="HingeDetail"
        component={HingeDetailScreen}
        options={{ title: "Hinge" }}
      />
      <Stack.Screen
        name="HallwayHome"
        component={HallwayHomeScreen}
        options={{ title: "Hallway" }}
      />
      <Stack.Screen
        name="HomeHallway"
        component={HomeHallway}
        options={{ title: "Home Hallway" }}
      />
      <Stack.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ title: "Activity" }}
      />
      <Stack.Screen
        name="RenameDevice"
        component={RenameDeviceScreen}
        options={{ title: "Rename Device" }}
      />
      <Stack.Screen
        name="SuperResponder"
        component={SuperResponderScreen}
        options={{ headerShown: true, title: "Super Responder" }}
      />
      <Stack.Screen name="FunctionTest" component={FunctionTestScreen} options={{ title: "Function Test" }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <AppStack /> : <AuthStack />;
}
