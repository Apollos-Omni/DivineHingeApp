import React from "react";
import { View, Text, ScrollView, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Pressable } from "react-native";

const DoorCard = ({
  title,
  image,
  onOpen,
}: {
  title: string;
  image: any;
  onOpen: () => void;
}) => {
  const scale = useSharedValue(1);
  const openAnim = useSharedValue(0);

  const onPress = () => {
    scale.value = withTiming(
      1.05,
      { duration: 140, easing: Easing.out(Easing.quad) },
      () => {
        openAnim.value = withTiming(
          1,
          { duration: 500, easing: Easing.inOut(Easing.cubic) },
          () => runOnJS(onOpen)(),
        );
      },
    );
  };

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const doorStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { rotateY: `${-openAnim.value * 70}deg` },
    ],
  }));

  return (
    <Pressable onPress={onPress} style={{ width: "100%" }}>
      <Animated.View style={[{ borderRadius: 20, overflow: "hidden" }, rStyle]}>
        <View style={{ height: 140, backgroundColor: "#1b1b26" }}>
          <Animated.View style={[{ flex: 1 }, doorStyle]}>
            <ImageBackground
              source={image}
              resizeMode="cover"
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <View
                style={{ backgroundColor: "rgba(0,0,0,0.35)", padding: 12 }}
              >
                <Text
                  style={{ color: "white", fontWeight: "800", fontSize: 18 }}
                >
                  {title}
                </Text>
              </View>
            </ImageBackground>
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function HomeHallway() {
  const navigation = useNavigation<any>();
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
        {/* Map these to your EXISTING route names */}
        <DoorCard
          title="Locks"
          image={require("../../assets/backgrounds/door1.avif")}
          onOpen={() => navigation.navigate("Locks")}
        />
        <DoorCard
          title="Schedules"
          image={require("../../assets/backgrounds/door2.avif")}
          onOpen={() => navigation.navigate("Schedules")}
        />
        <DoorCard
          title="Video"
          image={require("../../assets/backgrounds/door3.avif")}
          onOpen={() => navigation.navigate("Video")}
        />
      </View>
    </ScrollView>
  );
}
