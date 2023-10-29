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
  const [appState, setAppState] = React.useState({
    isStarted: false,
    isLoaded: false,
    currentQuestionIndex: 0,
    rightCount: 0,
    wrongCount: 0,
    showRightGif: false,
    isNetworkError: false,
    isModalVisible: false,
  });
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
  }, [appState.rightCount]);

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
  }, [appState.currentQuestionIndex]);

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

  const fetchTriviaData = async () => {
    try {
      const response = await axios.get(
        "https://opentdb.com/api.php?amount=50&type=multiple"
      ); // Замените URL на необходимый для Trivia API
      if (response.status === 200) {
        // Получите данные из ответа и установите их в состояние
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
        setAppState({ ...appState, isNetworkError: true });
        console.error("Ошибка при запросе данных");
      }
    } catch (error) {
      setAppState({ ...appState, isNetworkError: true });
      console.error("Произошла ошибка при выполнении запроса:", error);
    } finally {
      setAppState({ ...appState, isStarted: false });
      setTimeout(() => setAppState({ ...appState, isLoaded: true }), 1500);
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
            setAppState({ ...appState, showRightGif: true });
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
      setAppState({
        ...appState,
        isStarted: false,
        isLoaded: false,
        currentQuestionIndex: 0,
        rightCount: 0,
        wrongCount: 0,
      });
    } else {
      setAppState({
        ...appState,
        isStarted: false,
        isLoaded: false,
        currentQuestionIndex: 0,
        rightCount: 0,
        wrongCount: 0,
      });
      fetchTriviaData();
    }
  }
  async function nextQuestion() {
    if (appState.currentQuestionIndex === questions.length - 1) {
      fetchTriviaData();
      setAppState({ ...appState, isStarted: true });
    }
    await playSound("whoosh");
    setAppState({
      ...appState,
      currentQuestionIndex: appState.currentQuestionIndex + 1,
      isLoaded: true,
      showRightGif: false,
    });
  }

  const currentQuestion =
    questions === null ? null : questions[appState.currentQuestionIndex];

  return (
    <View style={[styles.container]}>
      {appState.isLoaded === false ? (
        <Loading />
      ) : appState.isNetworkError === true ? (
        <NetworkError fetchTriviaData={fetchTriviaData} />
      ) : appState.isStarted === false ? (
        <StartScreen newGame={newGame} />
      ) : appState.wrongCount > 0 ? (
        <Lost newGame={newGame} />
      ) : (
        <Animated.View
          entering={FadeInRight.duration(500).delay(500)}
          exiting={FadeOutLeft.duration(500)}
          style={[styles.container]}
        >
          <View style={{ alignItems: "center", width: "100%", height: "15%" }}>
            {appState.showRightGif === true && <RightGif />}
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
            rightCount={appState.rightCount}
            currentQuestionIndex={appState.currentQuestionIndex}
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
