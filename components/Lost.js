import React from "react";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./Styles";

export default function Lost(props) {
  return (
    <View style={[styles.container]}>
      <Animated.View
        entering={FadeInRight.duration(500)}
        exiting={FadeOutLeft.duration(500)}
      >
        <LottieView
          style={{ height: 200, width: 200 }}
          source={require("../assets/Animations/shocked.json")}
          loop
          autoPlay
        />
      </Animated.View>
      <Animated.Text
        entering={FadeInDown.duration(500)}
        exiting={FadeOutDown.duration(500)}
        style={[
          styles.rightCount,
          {
            fontSize: 30,
            marginTop: 20,
            marginBottom: 20,
            color: "#F8BCBC",
          },
        ]}
      >
        YOU LOST
      </Animated.Text>
      <Animated.View
        entering={FadeInDown.duration(500)}
        exiting={FadeOutDown.duration(500)}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            width: 200,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
          }}
          onPress={props.newGame}
        >
          <Text style={[styles.buttonText, { fontSize: 20 }]}>New game</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
