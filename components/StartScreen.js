import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./Styles";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

export default function StartScreen(props) {
  return (
    <View>
      <Animated.View
        entering={FadeInDown.duration(500).delay(250)}
        exiting={FadeOutUp.duration(500)}
        style={styles.container}
      >
        <TouchableOpacity onPress={props.newGame}>
          <Text style={[styles.rightCount, { fontSize: 40 }]}>
            {" "}
            Quiz <Text style={styles.emoji}>❗</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
