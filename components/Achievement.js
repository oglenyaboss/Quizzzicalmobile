import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import LottieView from "lottie-react-native";
import { styles } from "./Styles";
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  FadeInLeft,
  FadeOutLeft,
  FadeInRight,
} from "react-native-reanimated";

export default function Achievement(props) {
  const styleLocked =
    props.achievement.state === "locked"
      ? styles.achievementLocked
      : styles.achievementUnlocked;

  return (
    <View style={styles.achievementContainer}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Animated.Text
          entering={FadeInUp.duration(500).delay(250)}
          style={styles.achievementTitle}
        >
          Achievements
        </Animated.Text>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            entering={FadeInRight.duration(500).delay(500)}
            exiting={FadeOutLeft.duration(500)}
            key={props.achievement.name}
          >
            <LottieView
              style={[styleLocked, { height: 150, width: 150 }]}
              source={props.achievement.image}
              autoPlay={props.achievement.state === "locked" ? false : true}
              loop={props.achievement.state === "locked" ? false : true}
            />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(500).delay(750)}
            style={styles.achievementDescription}
          >
            {props.achievement.description}
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
