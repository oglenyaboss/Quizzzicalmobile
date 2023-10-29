import { View } from "react-native";
import React from "react";
import axios from "axios";
import { customAlphabet } from "nanoid/non-secure";
import Quiz from "./components/Quiz";
import { decode } from "html-entities";
import { useFonts } from "expo-font";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import Lost from "./components/Lost";
import NetworkError from "./components/NetworkError";
import StartScreen from "./components/StartScreen";
import Loading from "./components/Loading";
import { styles } from "./components/Styles";
import RightGif from "./components/RightGif";
import BottomScreen from "./components/BottomScreen";

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
  const [isModalVisible, setModalVisible] = React.useState(false);

  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
  const [loaded] = useFonts({
    Karla: require("./assets/Karla/Karla-VariableFont_wght.ttf"),
    "Karla-700": require("./assets/Karla/static/Karla-Bold.ttf"),
    "Inter-500": require("./assets/Inter/static/Inter-Regular.ttf"),
    "Inter-700": require("./assets/Inter/static/Inter-Bold.ttf"),
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

  async function playSound(name) {
    console.log(wrongCount);
    console.log("Loading Sound");
    let { sound } = await Audio.Sound.createAsync(
      require("./assets/Sounds/whoosh.mp3")
    );
    if (name === "correct") {
      ({ sound } = await Audio.Sound.createAsync(
        require("./assets/Sounds/correct.mp3")
      ));
    } else if (name === "wrong") {
      ({ sound } = await Audio.Sound.createAsync(
        require("./assets/Sounds/wrong.mp3")
      ));
    } else if (name === "whoosh") {
      ({ sound } = await Audio.Sound.createAsync(
        require("./assets/Sounds/whoosh.mp3")
      ));
    } else {
      ({ sound } = await Audio.Sound.createAsync(
        require("./assets/Sounds/sad.mp3")
      ));
    }
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function playSadSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/Sounds/sad.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function playCorrectSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/Sounds/correct.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function playWrongSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/Sounds/wrong.mp3")
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
          playSound("correct");
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
          playSound();
          setTimeout(
            () =>
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
            250
          );
        } else {
          playSound("wrong");
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
    await playSound("whoosh");
    setCurrentQuestionIndex((index) => index + 1);
    setIsLoaded(true);
    setShowRightGif(false);
  }

  const currentQuestion =
    questions === null ? null : questions[currentQuestionIndex];

  return (
    <View style={[styles.container]}>
      {isLoaded === false ? (
        <Loading />
      ) : isNetworkError === true ? (
        <NetworkError fetchTriviaData={fetchTriviaData} />
      ) : isStarted === false ? (
        <StartScreen newGame={newGame} />
      ) : wrongCount > 0 ? (
        <Lost newGame={newGame} />
      ) : (
        <Animated.View
          entering={FadeInRight.duration(500).delay(500)}
          exiting={FadeOutLeft.duration(500)}
          style={[styles.container]}
        >
          <View style={{ alignItems: "center", width: "100%", height: "15%" }}>
            {showRightGif === true && <RightGif />}
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
          <BottomScreen
            rightCount={rightCount}
            currentQuestionIndex={currentQuestionIndex}
            questions={questions}
            previousQuestion={previousQuestion}
            nextQuestion={nextQuestion}
            animationRef={animationRef}
          />
        </Animated.View>
      )}
    </View>
  );
}
