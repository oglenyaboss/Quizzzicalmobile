import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Animated, {
  FadeInRight,
  FadeOut,
  FadeIn,
  FadeInUp,
  FadeOutLeft,
  FadeOutDown,
} from "react-native-reanimated";

export default function Quiz(props) {
  let questionLength = props.currentQuestion.question.length;
  const questionFontSize =
    questionLength < 30
      ? RFValue(30)
      : questionLength < 40
      ? RFValue(28)
      : questionLength < 50
      ? RFValue(26)
      : questionLength < 60 ? RFValue(24)
      : questionLength < 70 ? RFValue(22)
      : RFValue(20);
      
  const answers = props.currentQuestion.answers.map((answer) => {
    let answerLength = answer.text.length;
    const answerFontSize =
      answerLength < 10
        ? RFValue(20)
        : answerLength < 20
        ? RFValue(18)
        : answerLength < 30
        ? RFValue(14)
        : RFValue(12);

    if (props.currentQuestion.isChecked) {
      let style;
      if (answer.isHeld) {
        style = answer.isRight ? styles.answerRight : styles.answerWrong;
      } else {
        style = answer.isCorrect ? styles.answerRight : styles.answerInactive;
      }
      return (
        <Animated.View
          key={answer.answerId}
          entering={FadeInRight.duration(250).delay(250)}
          exiting={FadeOutLeft.duration(250)}
          style={[styles.answersContainer]}
        >
          <TouchableOpacity
            disabled={props.currentQuestion.isChecked}
            style={[styles.button, style]}
            key={answer.answerId}
            onPress={() => {
              props.holdAnswer(props.currentQuestion.id, answer.answerId);
            }}
          >
            <Text style={[styles.answerText, { fontSize: answerFontSize }]}>
              {answer.text}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          key={answer.answerId}
          entering={FadeInRight.duration(750).delay(250)}
          exiting={FadeOutLeft.duration(250)}
        >
          <TouchableOpacity
            disabled={props.currentQuestion.isChecked}
            style={styles.button}
            key={answer.answerId}
            onPress={() => {
              props.holdAnswer(props.currentQuestion.id, answer.answerId);
              console.log(
                answer.text,
                answer.isHeld,
                answer.isRight,
                answer.isCorrect
              );
            }}
          >
            <Text style={[styles.answerText, { fontSize: answerFontSize }]}>
              {answer.text}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }
  });
  return (
    <Animated.View
    entering={FadeIn.duration(500).delay(500)}
    exiting={FadeOut.duration(500)}
    style={[styles.quizContainer]}>
      <View
        style={[styles.questionContainer]}
      >
        <Animated.Text
        entering={FadeInUp.duration(500).delay(500)}
        exiting={FadeOutDown.duration(250)}
        style={[styles.questionText, { fontSize: questionFontSize }]}>
          {props.currentQuestion.question}
        </Animated.Text>
      </View>
      <View style={styles.answersContainer}>{answers}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    width: "80%",
    minHeight: "20%",
    height: "40%",
    justifyContent: "center",
    marginBottom: "2%",
  },
  answersContainer: {
    backgroundColor: "#F5F7FB",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quizContainer: {
    width: "100%",
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "60%",
    minWidth: "60%",
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#4D5B9E",
    marginBottom: "2%",
    padding: "2%",
  },
  answerRight: {
    backgroundColor: "#94D7A2",
    borderWidth: 0,
  },
  answerWrong: {
    backgroundColor: "#F8BCBC",
    opacity: 0.5,
    borderWidth: 0,
  },
  answerInactive: {
    opacity: 0.3,
  },
  questionText: {
    color: "#293264",
    fontFamily: "Karla",
    fontWeight: "bold",
  },
  answerText: {
    color: "#293264",
    fontFamily: "Inter-500",
  },
});
