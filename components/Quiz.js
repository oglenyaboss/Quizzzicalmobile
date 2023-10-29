import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Animated, {
  FadeInRight,
  FadeOut,
  FadeIn,
  FadeInUp,
  FadeOutLeft,
  FadeOutDown,
} from "react-native-reanimated";
import { styles } from "./Styles";

export default function Quiz(props) {
  let questionLength = props.currentQuestion.question.length;
  const questionFontSize =
    questionLength < 30
      ? RFValue(30)
      : questionLength < 40
      ? RFValue(28)
      : questionLength < 50
      ? RFValue(26)
      : questionLength < 60
      ? RFValue(24)
      : questionLength < 70
      ? RFValue(22)
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
      style={[styles.quizContainer]}
    >
      <View style={[styles.questionContainer]}>
        <Animated.Text
          entering={FadeInUp.duration(500).delay(500)}
          exiting={FadeOutDown.duration(250)}
          style={[styles.questionText, { fontSize: questionFontSize }]}
        >
          {props.currentQuestion.question}
        </Animated.Text>
      </View>
      <View style={styles.answersContainer}>{answers}</View>
    </Animated.View>
  );
}
