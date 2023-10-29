import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import axios from "axios";
import { customAlphabet } from "nanoid/non-secure";
import Quiz from "./Quiz";
import { decode } from "html-entities";
import { useFonts } from "expo-font";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeOutDown,
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import AnimatedView from "react-native-reanimated/src/reanimated2/component/View";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

export default function App() {
  const [sound, setSound] = React.useState();
  const [questions, setQuestions] = React.useState(null);
  const [isStarted, setIsStarted] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [rightCount, setRightCount] = React.useState(0);
  const [wrongCount, setWrongCount] = React.useState(0);
  const [showRightGif, setShowRightGif] = React.useState(false);
  const [isNetworkError, setNetworkError] = React.useState(false);

  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
  const [loaded] = useFonts({
    Karla: require("../assets/Karla/static/Karla-Regular.ttf"),
    "Inter-500": require("../assets/Inter/static/Inter-Regular.ttf"),
    "Inter-700": require("../assets/Inter/static/Inter-Bold.ttf"),
  });

  const animationRef = React.useRef(null);

  React.useEffect(() => {
    fetchTriviaData();
  }, []);

  React.useEffect(() => {
    animationRef.current?.play(0, 150);
  }, [rightCount]);

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  React.useEffect(() => {
    if (loaded) {
      console.log(currentQuestion.correct_answer);
    }
  }, [currentQuestionIndex]);

  function removeHtmlTags(str) {
    return decode(str);
  }

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  async function playSound() {
    console.log(wrongCount);
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/Sounds/whoosh.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function playSadSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/Sounds/sad.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function playCorrectSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/Sounds/correct.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function playWrongSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/Sounds/wrong.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  const fetchTriviaData = async () => {
    try {
      const response = await axios.get(
        "https://opentdb.com/api.php?amount=50&type=multiple"
      ); // Замените URL на необходимый для Trivia API
      if (response.status === 200) {
        // Получите данные из ответа и установите их в состояние
        setNetworkError(false);
        setQuestions(
          response.data.results.map((question) => {
            const mergedArray = [
              ...question.incorrect_answers,
              question.correct_answer,
            ];
            const shuffledArray = shuffleArray(
              mergedArray.map((answer) => ({
                answerId: nanoid(),
                text: removeHtmlTags(answer),
                isHeld: false,
                isCorrect: question.correct_answer === answer,
                isRight: undefined,
              }))
            );
            console.log(question.correct_answer);
            return {
              ...question,
              isChecked: false,
              correct_answer: removeHtmlTags(question.correct_answer),
              question: removeHtmlTags(question.question),
              answers: shuffledArray,
              id: nanoid(),
            };
          })
        );
      } else {
        setNetworkError(true);
        console.error("Ошибка при запросе данных");
      }
    } catch (error) {
      setNetworkError(true);
      console.error("Произошла ошибка при выполнении запроса:", error);
    } finally {
      setIsStarted(false);
      setTimeout(() => setIsLoaded(true), 1500);
    }
  };
  function holdAnswer(id, answerId) {
    setQuestions((questions) =>
      questions.map((question) => {
        if (question.id !== id) return question;

        let isRight = false;

        const updatedAnswers = question.answers.map((answer) => {
          if (answer.answerId !== answerId) {
            return { ...answer, isHeld: false };
          }

          const isCorrect = answer.text === question.correct_answer;
          const isHeld = !answer.isHeld;
          isRight = answer.isCorrect === isHeld;

          if (isRight) {
            setShowRightGif(true);
          }

          return { ...answer, isHeld, isRight };
        });

        const rightAnswer = updatedAnswers.find((answer) => answer.isCorrect);

        let wrongCountNum = 0;

        if (rightAnswer && rightAnswer.isHeld) {
          setRightCount((count) => count + 1);
          playCorrectSound();
          setTimeout(
            () =>
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              ),
            250
          );
        } else if (rightCount > 0) {
          wrongCountNum++;
          setWrongCount(wrongCountNum);
          console.log(wrongCount + " count ");
          playSadSound();
          setTimeout(
            () =>
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
            250
          );
        } else {
          playWrongSound();
          setTimeout(
            () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
            250
          );
        }

        wrongCountNum === 0 &&
          setTimeout(() => nextQuestion(), isRight ? 2000 : 1000);

        return { ...question, isChecked: true, answers: updatedAnswers };
      })
    );
  }

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowRightGif(false);
    }
    if (currentQuestionIndex === questions.length - 1) {
      fetchTriviaData();
      setCurrentQuestionIndex(0);
      console.log("end");
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowRightGif(false);
    }
  }

  function newGame() {
    if (currentQuestionIndex === 0) {
      setCurrentQuestionIndex(0);
      setRightCount(0);
      setWrongCount(0);
      setIsStarted(true);
    } else {
      setCurrentQuestionIndex(0);
      setRightCount(0);
      setWrongCount(0);
      setIsLoaded(false);
      fetchTriviaData();
      setIsStarted(false);
    }
  }
  async function nextQuestion() {
    if (currentQuestionIndex === questions.length - 1) {
      fetchTriviaData();
      setIsStarted(true);
    }
    await playSound();
    setCurrentQuestionIndex((index) => index + 1);
    setIsLoaded(true);
    setShowRightGif(false);
  }

  const currentQuestion =
    questions === null ? null : questions[currentQuestionIndex];

  return (
    <View style={[styles.container]}>
      {isLoaded === false ? (
        <Animated.View
          entering={FadeInRight.duration(500)}
          exiting={FadeOutLeft.duration(500)}
        >
          <LottieView
            style={{width: 200 }}
            source={require("../assets/Animations/CLOCK.json")}
            loop
            autoPlay
          />
        </Animated.View>
      ) : isNetworkError === true ? (
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
          <TouchableOpacity onPress={fetchTriviaData}>
            <Animated.Text
              entering={FadeInDown.duration(500)}
              exiting={FadeOutDown.duration(100)}
              style={[styles.buttonText, { fontSize: 20 }]}
            >
              Try again
            </Animated.Text>
          </TouchableOpacity>
        </View>
      ) : isStarted === false ? (
        <View>
          <AnimatedView
            entering={FadeInDown.duration(500).delay(250)}
            exiting={FadeOutUp.duration(500)}
            style={styles.container}
          >
            <TouchableOpacity onPress={newGame}>
              <Text style={[styles.rightCount, { fontSize: 40 }]}>
                {" "}
                Quiz <Text style={styles.emoji}>❗</Text>
              </Text>
            </TouchableOpacity>
          </AnimatedView>
        </View>
      ) : wrongCount > 0 ? (
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
              onPress={newGame}
            >
              <Text style={[styles.buttonText, { fontSize: 20 }]}>
                New game
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <Animated.View
          entering={FadeInRight.duration(500).delay(500)}
          exiting={FadeOutLeft.duration(500)}
          style={[styles.container]}
        >
          <View style={{ alignItems: "center", width: "100%", height: "15%" }}>
            {showRightGif === true && (
              <Animated.View
                entering={FadeInUp.duration(500)}
                exiting={FadeOutUp.duration(500)}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <LottieView
                  style={{ width: 100, height: 100 }}
                  source={require("../assets/LAMP.json")}
                  loop
                  autoPlay
                  renderMode="SOFTWARE"
                />
              </Animated.View>
            )}
          </View>
          <View
            style={{
              height: "50%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Quiz
              currentQuestion={currentQuestion}
              key={currentQuestion.id}
              holdAnswer={holdAnswer}
              nextQuestion={nextQuestion}
            />
          </View>
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
              style={{width: 30, height: 30, scaleX: 0.25, scaleY: 0.25 }}
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
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  rightCount: {
    fontFamily: "Inter-700",
    color: "#293264",
    fontSize: 25,
  },
  buttonsContainer: {
    marginTop: 20,
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsContainerStart: {
    marginTop: 20,
    width: "60%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  emoji: {
    fontSize: 40,
  },
  buttonText: {
    fontFamily: "Inter-500",
    color: "#293264",
    fontSize: 15,
  },
  button: {
    width: "60%",
    minWidth: "60%",
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#4D5B9E",
    marginBottom: "2%",
    padding: "2%",
  },
});
