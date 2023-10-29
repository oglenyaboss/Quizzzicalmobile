import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./Styles";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import LottieView from "lottie-react-native";

export default function BottomScreen(props) {
  const {
    questions,
    currentQuestionIndex,
    nextQuestion,
    previousQuestion,
    rightCount,
    animationRef,
  } = props;
  return (
    <>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={[styles.rightCount]}>Correct streak:</Text>
        <Animated.Text
          key={rightCount}
          entering={FadeInUp.duration(250)}
          exiting={FadeOutDown.duration(250)}
          style={[styles.rightCount]}
        >
          {` ${rightCount} `}
        </Animated.Text>
        <LottieView
          style={{ width: 30, height: 30, scaleX: 0.25, scaleY: 0.25 }}
          source={require("../assets/Animations/✅.json")}
          ref={animationRef}
          loop={false}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={
            currentQuestionIndex === 0
              ? styles.buttonsContainerStart
              : styles.buttonsContainer
          }
        >
          {currentQuestionIndex > 0 && (
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={previousQuestion}
            >
              <Text style={styles.emoji}>⬅️</Text>
              <Text style={styles.buttonText}>Prev</Text>
            </TouchableOpacity>
          )}
          {currentQuestionIndex < questions.length && (
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={nextQuestion}
            >
              <Text style={styles.emoji}>➡️</Text>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}
