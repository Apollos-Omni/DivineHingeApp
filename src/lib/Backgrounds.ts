// DivineHingeApp/src/lib/Backgrounds.ts
import { ImageSourcePropType } from "react-native";

// ✅ Keep only images in this map; quote numeric keys; ensure every line ends cleanly.
export const backgroundImages: Record<string, ImageSourcePropType> = {
  door1: require("../assets/backgrounds/door1.avif"),
  door2: require("../assets/backgrounds/door2.avif"),
  door3: require("../assets/backgrounds/door3.avif"),
  door4: require("../assets/backgrounds/door4.avif"),
  door: require("../assets/backgrounds/door.avif"),
  img: require("../assets/backgrounds/images.png"),
  img1: require("../assets/backgrounds/images1.png"),
  B0: require("../assets/backgrounds/B0.png"),
  images: require("../assets/backgrounds/images.png"),
  img4: require("../assets/backgrounds/images14.png"),
  img5: require("../assets/backgrounds/images5.png"),
  img6: require("../assets/backgrounds/images6.png"),
  img7: require("../assets/backgrounds/images7.png"),
};

// ✅ Export video separately (don’t type it as ImageSourcePropType).
export const backgroundVideo = require("../assets/backgrounds/doorvideo.mp4");
