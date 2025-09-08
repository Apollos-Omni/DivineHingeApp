import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Backgrounds from '../../lib/Backgrounds';

export default function BackgroundScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={backgrounds.img42} style={styles.background}>
        {/* Your screen content goes here */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, resizeMode: "cover" },
});
