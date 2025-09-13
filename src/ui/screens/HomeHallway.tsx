import React from "react";
import { View, Text, ScrollView } from "react-native";
import { DoorCard } from "../components/DoorCard";

export const HomeHallway = ({ navigation }: any) => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0b0b0f" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "800",
          marginBottom: 12,
        }}
      >
        Welcome Home
      </Text>
      <Text style={{ color: "#b7bece", marginBottom: 16 }}>
        Pick a door to continue.
      </Text>

      <View style={{ gap: 14 }}>
        <DoorCard
          title="Locks"
          image={require["../assets/doors/images12.png"]}
          onOpen={() => navigation.navigate("Locks")}
        />
        <DoorCard
          title="Schedules"
          image={require["../assets/doors/images39.png"]}
          onOpen={() => navigation.navigate("Schedules")}
        />
        <DoorCard
          title="Video"
          image={require["../assets/doors/B0.png"]}
          onOpen={() => navigation.navigate("Video")}
        />
      </View>
    </ScrollView>
  );
};
