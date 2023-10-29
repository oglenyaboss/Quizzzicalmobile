import React from "react";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeInDown,
  FadeOutDown,
  FadeInUp,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { View, TouchableOpacity } from "react-native";
import { styles } from "./Styles";

export default function NetworkError(props) {
  return (
    <View style={[styles.container]}>
      <Animated.View
        entering={FadeInUp.duration(500)}
        exiting={FadeOutDown.duration(100)}
      >
        <LottieView
          style={{ width: 200, height: 200 }}
          source={require("../assets/Animations/SAD.json")}
          loop
          autoPlay
        />
      </Animated.View>
      <Animated.Text
        style={[styles.rightCount, { fontSize: 30, color: "#F8BCBC" }]}
        entering={FadeInRight.duration(500)}
        exiting={FadeOutLeft.duration(100)}
      >
        NETWORK ERROR ⚠️
      </Animated.Text>
      <TouchableOpacity onPress={props.fetchTriviaData}>
        <Animated.Text
          entering={FadeInDown.duration(500)}
          exiting={FadeOutDown.duration(100)}
          style={[styles.buttonText, { fontSize: 20 }]}
        >
          Try again
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
}
