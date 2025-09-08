import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';

// src/ui/Backgrounds.ts
export const backgrounds = {
  door1: require('../../assets/backgrounds/door1.avif'),
  door2: require('../../assets/backgrounds/door2.avif'),
  door3: require('../../assets/backgrounds/door3.avif'),
  door4: require('../../assets/backgrounds/door4.avif'),
  door: require('../../assets/backgrounds/door.avif'),
  image22: require('../../assets/backgrounds/image22.png'),// add all others here
  image4: require('../../assets/backgrounds/image4.png'),
  image52: require('../../assets/backgrounds/image52.png'),
  images: require('../../assets/backgrounds/images.png'),
  images1: require('../../assets/backgrounds/images1.png'),
  images12: require('../../assets/backgrounds/images12.png'),
  images13: require('../../assets/backgrounds/images13.png'),
  images14: require('../../assets/backgrounds/images14.png'),
  images15: require('../../assets/backgrounds/images15.png'),
  images16: require('../../assets/backgrounds/images16.png'),
  images17: require('../../assets/backgrounds/images17.png'),
  images18: require('../../assets/backgrounds/images18.png'),
  images19: require('../../assets/backgrounds/images19.png'),
  images20: require('../../assets/backgrounds/images20.png'),
  images21: require('../../assets/backgrounds/images21.png'),
  images23: require('../../assets/backgrounds/images23.png'),
  images24: require('../../assets/backgrounds/images24.png'),
  images25: require('../../assets/backgrounds/images25.png'),
  images26: require('../../assets/backgrounds/images26.png'),
  images27: require('../../assets/backgrounds/images27.png'),
  images28: require('../../assets/backgrounds/images28.png'),
  images29: require('../../assets/backgrounds/images29.png'),
  images30: require('../../assets/backgrounds/images30.png'),
  images31: require('../../assets/backgrounds/images31.png'),
  images32: require('../../assets/backgrounds/images32.png'),
  images33: require('../../assets/backgrounds/images33.png'),
  images34: require('../../assets/backgrounds/images34.png'),
  images35: require('../../assets/backgrounds/images35.png'),
  images36: require('../../assets/backgrounds/images36.png'),
  images37: require('../../assets/backgrounds/images37.png'),
  images38: require('../../assets/backgrounds/images38.png'),
  images39: require('../../assets/backgrounds/images39.png'),
};


export const MyScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground source={Images} style={styles.background}>
        <Text style={styles.text}>Hello!</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // stretch or cover
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});
