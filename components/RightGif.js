import React from "react";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import LottieView from "lottie-react-native";

export default function RightGif() {
  return (
    <Animated.View
      entering={FadeInUp.duration(500)}
      exiting={FadeOutUp.duration(500)}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <LottieView
        style={{ width: 100, height: 100 }}
        source={require("../assets/Animations/LAMP.json")}
        loop
        autoPlay
      />
    </Animated.View>
  );
}
