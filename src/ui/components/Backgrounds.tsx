import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { backgroundImages } from "@/lib/Backgrounds"; // NOTE: capital B to match file

export default function BackgroundScreen() {
  return (
    <View style={styles.container}>
      {/* pick an existing key: img4 / img5 / door1 / door ... */}
      <ImageBackground source={backgroundImages.img4} style={styles.background}>
        {/* content */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, resizeMode: "cover" },
});
