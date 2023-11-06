import { View, Modal, Text } from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import GestureRecognizer from "react-native-swipe-gestures";

//npx expo run:ios --configuration Release --device 00008020-001634CA2068C93A
//npx expo run:ios --device 00008020-001634CA2068C93A

export default function App() {
  //TODO: create achievements and NFT
  const [sound, setSound] = React.useState();
  const [questions, setQuestions] = React.useState(null);
  const [appState, setAppState] = React.useState({
    isLoaded: false,
    isLost: false,
    showRightGif: false,
    isNetworkError: false,
    isModalVisible: false,
    category: "any",
    difficulty: "any",
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [isStarted, setIsStarted] = React.useState(false);
  const [counts, setCounts] = React.useState({
    rightCount: 0,
    wrongCount: 0,
  });
  const [stats, setStats] = React.useState({
    rightCount: 0,
    wrongCount: 0,
  });
  const animations = {
    achievementTen: require("./assets/Animations/10ach.json"),
    achievementTwentyFive: require("./assets/Animations/25ach.json"),
    achievementFifty: require("./assets/Animations/50ach.json"),
    achievementHundred: require("./assets/Animations/100ach.json"),
    achievementTwoHundredFifty: require("./assets/Animations/250ach.json"),
    achievementFiveHundred: require("./assets/Animations/500ach.json"),
    achievementThousand: require("./assets/Animations/MEDAL.json"),
    achievementTenThousand: require("./assets/Animations/CRYSTALL.json"),
  };
  const [achievements, setAchievements] = React.useState([
    {
      name: 10,
      description: "Correctly answer 10 questions",
      image: animations.achievementTen,
      state: "locked",
    },
    {
      name: 25,
      description: "Correctly answer 25 questions",
      image: animations.achievementTwentyFive,
      state: "locked",
    },
    {
      name: 50,
      description: "Correctly answer 50 questions",
      image: animations.achievementFifty,
      state: "locked",
    },
    {
      name: 100,
      description: "Correctly answer 100 questions",
      image: animations.achievementHundred,
      state: "locked",
    },
    {
      name: 250,
      description: "Correctly answer 250 questions",
      image: animations.achievementTwoHundredFifty,
      state: "locked",
    },
    {
      name: 500,
      description: "Correctly answer 500 questions",
      image: animations.achievementFiveHundred,
      state: "locked",
    },
    {
      name: 1000,
      description: "Correctly answer 1000 questions",
      image: animations.achievementThousand,
      state: "locked",
    },
    {
      name: 10000,
      description: "Correctly answer 10000 questions",
      image: animations.achievementTenThousand,
      state: "locked",
    },
  ]);

  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
  const [loaded] = useFonts({
    Karla: require("./assets/Karla/Karla-VariableFont_wght.ttf"),
    "Karla-700": require("./assets/Karla/static/Karla-Bold.ttf"),
    "Inter-500": require("./assets/Inter/static/Inter-Regular.ttf"),
    "Inter-700": require("./assets/Inter/static/Inter-Bold.ttf"),
  });

  const animationRef = React.useRef(null);

  React.useEffect(() => {
    if (stats.rightCount === 2) {
      setAchievements((prevState) => {
        return prevState.map((achievement) => {
          if (achievement.name === 10) {
            return { ...achievement, state: "unlocked" };
          } else {
            return achievement;
          }
        });
      });
      saveAchievements();
    } else if (stats.rightCount === 25) {
      setAchievements((prevState) => {
        return prevState.map((achievement) => {
          if (achievement.name === 25) {
            return { ...achievement, state: "unlocked" };
          } else {
            return achievement;
          }
        });
      });
      saveAchievements();
    } else if (stats.rightCount === 50) {
      setAchievements((prevState) => {
        return prevState.map((achievement) => {
          if (achievement.name === 50) {
            return { ...achievement, state: "unlocked" };
          } else {
            return achievement;
          }
        });
      });
      saveAchievements();
    } else if (stats.rightCount === 100) {
      setAchievements((prevState) => {
        return prevState.map((achievement) => {
          if (achievement.name === 100) {
            return { ...achievement, state: "unlocked" };
          } else {
            return achievement;
          }
        });
      });
      saveAchievements();
    } else if (stats.rightCount === 250) {
      setAchievements((prevState) => {
        return prevState.map((achievement) => {
          if (achievement.name === 250) {
            return { ...achievement, state: "unlocked" };
          } else {
            return achievement;
          }
        });
      });
      saveAchievements();
    } else if (stats.rightCount === 500) {
      setAchievements((prevState) => {
        return prevState.map((achievement) => {
          if (achievement.name === 500) {
            return { ...achievement, state: "unlocked" };
          } else {
            return achievement;
          }
        });
      });
      saveAchievements();
    } else if (stats.rightCount === 1000) {
      setAchievements((prevState) => {
        return prevState.map((achievement) => {
          if (achievement.name === 1000) {
            return { ...achievement, state: "unlocked" };
          } else {
            return achievement;
          }
        });
      });
      saveAchievements();
    } else {
      return;
    }
    saveAchievements();
  }, [stats]);

  React.useEffect(() => {
    fetchTriviaData();
    getData();
    getAchievements();
  }, []);

  React.useEffect(() => {
    fetchTriviaData();
  }, [appState.category, appState.difficulty]);

  React.useEffect(() => {
    saveData();
  }, [stats.wrongCount, counts.rightCount]);

  React.useEffect(() => {
    animationRef.current?.play(0, 150);
  }, [stats.rightCount]);

  React.useEffect(() => {
    return sound
      ? () => {
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

  // Function to modify category and difficulty
  const modifyAppState = (newCategory, newDifficulty) => {
    setAppState((prevState) => ({
      ...prevState,
      category: newCategory,
      difficulty: newDifficulty,
    }));
  };

  const saveAchievements = async () => {
    try {
      await AsyncStorage.setItem("achievements", JSON.stringify(achievements));
      console.log(achievements + "save");
    } catch (e) {
      console.log(e);
    }
  };

  const getAchievements = async () => {
    try {
      const achievements = await AsyncStorage.getItem("achievements");
      console.log(achievements[0].state + "get");
      if (achievements !== null) {
        setAchievements(JSON.parse(achievements));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("wrongCount", stats.wrongCount.toString());
      await AsyncStorage.setItem("rightCount", stats.rightCount.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const wrongCount = await AsyncStorage.getItem("wrongCount");
      const rightCount = await AsyncStorage.getItem("rightCount");
      if (wrongCount !== null && rightCount !== null) {
        setStats({
          wrongCount: parseInt(wrongCount),
          rightCount: parseInt(rightCount),
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

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

    await sound.playAsync();
  }

  const fetchTriviaData = async () => {
    try {
      const link =
        appState.category === "any" && appState.difficulty === "any"
          ? `https://opentdb.com/api.php?amount=10&type=multiple`
          : appState.category === "any"
          ? `https://opentdb.com/api.php?amount=10&difficulty=${appState.difficulty}&type=multiple`
          : appState.difficulty === "any"
          ? `https://opentdb.com/api.php?amount=10&category=${appState.category}&type=multiple`
          : `https://opentdb.com/api.php?amount=10&category=${appState.category}&difficulty=${appState.difficulty}&type=multiple`;
      const response = await axios.get(link);
      if (response.status === 200) {
        const newQuestions = response.data.results.map((question) => {
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
          return {
            ...question,
            isChecked: false,
            correct_answer: removeHtmlTags(question.correct_answer),
            question: removeHtmlTags(question.question),
            answers: shuffledArray,
            id: nanoid(),
          };
        });

        // Push new questions to existing questions
        currentQuestionIndex === 0
          ? setQuestions(() => newQuestions)
          : setQuestions((questions) => [...questions, ...newQuestions]);
      } else {
        setAppState({ ...appState, isNetworkError: true });
        console.error("Error fetching data");
      }
    } catch (error) {
      setAppState({ ...appState, isNetworkError: true });
      console.error("Error fetching:", error);
    } finally {
      setTimeout(() => {
        setAppState({ ...appState, isLoaded: true });
      }, 2000);
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

        if (rightAnswer && rightAnswer.isHeld) {
          setCounts({ ...counts, rightCount: counts.rightCount + 1 });
          setStats((prevState) => {
            return { ...prevState, rightCount: prevState.rightCount + 1 };
          });
          playSound("correct");
          setTimeout(
            () =>
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              ),
            250
          );
          setTimeout(() => nextQuestion(), isRight ? 2000 : 1000);
        } else if (counts.rightCount > 0) {
          setAppState({ ...appState, isLost: true });
          setCounts({ ...counts, wrongCount: counts.wrongCount + 1 });
          setStats((prevState) => {
            return { ...prevState, wrongCount: prevState.wrongCount + 1 };
          });
          setCurrentQuestionIndex(0);
          playSound();
          setTimeout(
            () =>
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
            250
          );
        } else {
          setStats((prevState) => {
            return { ...prevState, wrongCount: prevState.wrongCount + 1 };
          });
          playSound("wrong");
          setTimeout(
            () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
            250
          );
          setTimeout(() => nextQuestion(), isRight ? 2000 : 1000);
        }

        return { ...question, isChecked: true, answers: updatedAnswers };
      })
    );
  }
  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      setAppState({
        ...appState,
        showRightGif: false,
      });
      setCurrentQuestionIndex((prevState) => prevState - 1);
    }
  }
  async function newGame() {
    setAppState({
      ...appState,
      isLoaded: false,
      isLost: false,
    });
    setCounts({
      rightCount: 0,
      wrongCount: 0,
    });
    setIsStarted(false);
    setCurrentQuestionIndex(0);
    await fetchTriviaData();
    setTimeout(() => {
      setAppState({ ...appState, isLoaded: true });
    }, 2500);
  }

  function startGame() {
    setIsStarted(true);
  }
  async function nextQuestion() {
    if (currentQuestionIndex === questions.length - 4) {
      fetchTriviaData();
      setIsStarted(true);
    }
    await playSound("whoosh");
    setCurrentQuestionIndex((prevState) => prevState + 1);
    setAppState((prevState) => {
      return {
        ...prevState,
        showRightGif: false,
      };
    });
  }

  const currentQuestion =
    questions === null ? null : questions[currentQuestionIndex];

  return (
    <View style={[styles.container]}>
      {appState.isLoaded === false ? (
        <Loading />
      ) : appState.isNetworkError === true ? (
        <NetworkError fetchTriviaData={fetchTriviaData} />
      ) : isStarted === false ? (
        <StartScreen
          modifyAppState={modifyAppState}
          newGame={startGame}
          wrong={stats.wrongCount}
          right={stats.rightCount}
          achievements={achievements}
        />
      ) : counts.wrongCount > 0 ? (
        <Lost newGame={newGame} />
      ) : (
        <Animated.View
          entering={FadeInRight.duration(500).delay(1500)}
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
            <GestureRecognizer
              onSwipeLeft={() => nextQuestion()}
              onSwipeRight={() => {
                previousQuestion();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80,
              }}
              style={{
                flex: 1,
                backgroundColor: "transparent",
              }}
            >
              <Quiz
                currentQuestion={currentQuestion}
                key={currentQuestion.id}
                holdAnswer={holdAnswer}
                nextQuestion={nextQuestion}
              />
            </GestureRecognizer>
          </View>
          <BottomScreen
            rightCount={counts.rightCount}
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
