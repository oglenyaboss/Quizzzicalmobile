import React from "react";
import { View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import LottieView from "lottie-react-native";

export default function Loading() {
  return (
    <View>
      <Animated.View
        entering={FadeInRight.duration(500)}
        exiting={FadeOutLeft.duration(500)}
      >
        <LottieView
          style={{ width: 200 }}
          source={require("../assets/Animations/CLOCK.json")}
          loop
          autoPlay
        />
      </Animated.View>
    </View>
  );
}
