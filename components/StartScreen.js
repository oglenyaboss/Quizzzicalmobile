import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import { styles } from "./Styles";
import LottieView from "lottie-react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  FadeIn,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import PieChart from "react-native-pie-chart";
import Achievement from "./Achievement";
import GestureRecognizer from "react-native-swipe-gestures";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import {
  ConnectWallet,
  ThirdwebProvider,
  ThirdwebSDK,
  metamaskWallet,
  walletConnect,
} from "@thirdweb-dev/react-native";
import { Mumbai } from "@thirdweb-dev/chains";

export default function StartScreen(props) {
  const sdk = new ThirdwebSDK("mumbai", {
    clientId: "daa58531fdd7f13b87448bbe5ac5e252",
  });

  const animationRef = React.useRef(null);
  const animationRef2 = React.useRef(null);
  const animationRef3 = React.useRef(null);
  const animationRef4 = React.useRef(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState("stats");
  const [currentAchievementIndex, setCurrentAchievementIndex] =
    React.useState(0);
  const [category, setCategory] = React.useState("any");
  const [difficulty, setDifficulty] = React.useState("any");

  React.useEffect(() => {}, [category, difficulty]);

  function openStats() {
    setShowModal((prev) => !prev);
    animationRef.current?.play();
    setModalType("stats");
  }
  function openAchievements() {
    setShowModal((prev) => !prev);
    animationRef2.current?.play();
    setModalType("achievements");
  }
  function openSettings() {
    setShowModal((prev) => !prev);
    animationRef3.current?.play();
    setModalType("settings");
  }
  function newQuiz() {
    props.newGame();
    animationRef4.current?.play();
  }
  const chart_wh = 150;
  const series =
    props.right + props.wrong > 0 ? [props.right, props.wrong] : [1, 1];
  const sliceColor = ["#94D7A2", "#F8BCBC"];
  const total = props.right + props.wrong;
  const percent = props.wrong + props.right > 0 ? props.right / total : 0;

  const totalColor = (total) => {
    if (total < 50) {
      return "#ff5e5e";
    } else if (total < 75) {
      return "#F8BCBD";
    } else if (total < 150) {
      return "#3dc4b5";
    } else if (total < 300) {
      return "#1fff69";
    }
  };

  const percentColor = (percent) => {
    if (percent < 10) {
      return "#ff5e5e";
    } else if (percent < 25) {
      return "#F8BCBD";
    } else if (percent < 50) {
      return "#3dc4b5";
    } else if (percent < 75) {
      return "#1fff69";
    }
  };

  function nextAchievement() {
    if (currentAchievementIndex < props.achievements.length - 1) {
      setCurrentAchievementIndex((prev) => prev + 1);
    } else {
      setCurrentAchievementIndex(0);
    }
  }

  function prevAchievement() {
    if (currentAchievementIndex > 0) {
      setCurrentAchievementIndex((prev) => prev - 1);
    } else {
      setCurrentAchievementIndex(props.achievements.length - 1);
    }
  }

  const categories = [
    {
      label: "Any Category",
      value: "any",
    },
    {
      label: "General Knowledge",
      value: 9,
    },
    {
      label: "Entertainment: Books",
      value: 10,
    },
    {
      label: "Entertainment: Film",
      value: 11,
    },
    {
      label: "Entertainment: Music",
      value: 12,
    },
    {
      label: "Entertainment: Musicals & Theatres",
      value: 13,
    },
    {
      label: "Entertainment: Television",
      value: 14,
    },
    {
      label: "Entertainment: Video Games",
      value: 15,
    },
    {
      label: "Entertainment: Board Games",
      value: 16,
    },
    {
      label: "Science & Nature",
      value: 17,
    },
    {
      label: "Science: Computers",
      value: 18,
    },
    {
      label: "Science: Mathematics",
      value: 19,
    },
    {
      label: "Mythology",
      value: 20,
    },
    {
      label: "Sports",
      value: 21,
    },
    {
      label: "Geography",
      value: 22,
    },
    {
      label: "History",
      value: 23,
    },
    {
      label: "Politics",
      value: 24,
    },
    {
      label: "Art",
      value: 25,
    },
    {
      label: "Celebrities",
      value: 26,
    },
    {
      label: "Animals",
      value: 27,
    },
    {
      label: "Vehicles",
      value: 28,
    },
    {
      label: "Entertainment: Comics",
      value: 29,
    },
    {
      label: "Science: Gadgets",
      value: 30,
    },
    {
      label: "Entertainment: Japanese Anime & Manga",
      value: 31,
    },
    {
      label: "Entertainment: Cartoon & Animations",
      value: 32,
    },
  ];

  const currentAchievement = props.achievements
    ? props.achievements[currentAchievementIndex]
    : null;
  const activeChain = Mumbai;

  //TODO: Add a modal for achievements
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedChains={[activeChain]}
      clientId="daa58531fdd7f13b87448bbe5ac5e252"
      supportedWallets={[
        metamaskWallet({
          projectId: "1b257b2ba82bb52fcff360a0a1f210c4",
        }),
      ]}
    >
      <Animated.View
        entering={FadeInDown.duration(500).delay(250)}
        exiting={FadeOutUp.duration(500).delay(500)}
        style={styles.container}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          {modalType === "achievements" ? (
            ////////////////////////////ACHIEVEMENTS///////////////////////////
            <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
              <BlurView style={styles.modal} intensity={30} tint="light">
                <Animated.View
                  entering={FadeInDown.duration(500).delay(250)}
                  exiting={FadeOutUp.duration(500)}
                  style={[styles.modal]}
                  onPress={() => {
                    console.log("pressed");
                  }}
                >
                  <TouchableWithoutFeedback
                    style={[styles.modal, { borderWidth: 1 }]}
                    onPress={(e) => e.stopPropagation()}
                  >
                    <View style={[styles.stats]}>
                      <Animated.View
                        entering={FadeInUp.duration(500).delay(250)}
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <View style={{ width: "100%" }}>
                          <GestureRecognizer
                            onSwipeLeft={nextAchievement}
                            onSwipeRight={prevAchievement}
                            style={{ width: "100%" }}
                          >
                            <Achievement achievement={currentAchievement} />
                            <ConnectWallet />
                          </GestureRecognizer>
                        </View>
                      </Animated.View>
                    </View>
                  </TouchableWithoutFeedback>
                </Animated.View>
              </BlurView>
            </TouchableWithoutFeedback>
          ) : modalType === "settings" ? (
            //////////////////////SETTINGS///////////////////////////////////
            <TouchableWithoutFeedback
              onPress={() => {
                setShowModal(false);
                props.modifyAppState(category, difficulty);
              }}
            >
              <BlurView style={styles.modal} intensity={30} tint="light">
                <Animated.View
                  entering={FadeInDown.duration(500).delay(250)}
                  exiting={FadeOutUp.duration(500)}
                  style={styles.modal}
                  onPress={() => {
                    console.log("pressed");
                  }}
                >
                  <TouchableWithoutFeedback
                    style={[styles.stats, {}]}
                    onPress={(e) => e.stopPropagation()}
                  >
                    <View style={[styles.stats]}>
                      <Animated.View
                        entering={FadeInUp.duration(500).delay(250)}
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 20,
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Animated.Text>
                          <Text style={styles.rightCount}>Settings</Text>
                        </Animated.Text>
                        <Animated.View
                          style={{ width: "80%", alignItems: "center" }}
                        >
                          <Text
                            style={[
                              styles.answerText,
                              { fontSize: 20, marginBottom: 5 },
                            ]}
                          >
                            Category:{" "}
                          </Text>
                          <RNPickerSelect
                            style={{
                              ...defaultStyles,
                              inputIOS: {
                                fontSize: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                textAlign: "center",
                                borderWidth: 1,
                                borderColor: "#4D5B9E",
                                borderRadius: 20,
                                color: "#293264",
                              },
                              inputAndroid: {
                                fontSize: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                textAlign: "center",
                                borderWidth: 1,
                                borderColor: "#4D5B9E",
                                borderRadius: 20,
                                color: "#293264",
                              },
                            }}
                            placeholder={{
                              label: "Select a category...",
                              value: "any",
                            }}
                            onValueChange={(value) => setCategory(value)}
                            items={categories}
                          />
                        </Animated.View>
                        <Animated.View
                          style={{ width: "80%", alignItems: "center" }}
                        >
                          <Text
                            style={[
                              styles.answerText,
                              { fontSize: 20, marginBottom: 5 },
                            ]}
                          >
                            Difficulty:{" "}
                          </Text>
                          <RNPickerSelect
                            style={{
                              ...defaultStyles,
                              inputIOS: {
                                fontSize: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                textAlign: "center",
                                borderWidth: 1,
                                borderColor: "#4D5B9E",
                                borderRadius: 20,
                                color:
                                  difficulty === "easy"
                                    ? "#94D7A2"
                                    : difficulty === "medium"
                                    ? "#F8BCBC"
                                    : difficulty === "hard"
                                    ? "#ff5e5e"
                                    : "#293264",
                              },
                              inputAndroid: {
                                fontSize: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                textAlign: "center",
                                borderWidth: 1,
                                borderColor: "#4D5B9E",
                                borderRadius: 20,
                                color:
                                  difficulty === "easy"
                                    ? "#94D7A2"
                                    : difficulty === "medium"
                                    ? "#F8BCBC"
                                    : difficulty === "hard"
                                    ? "#ff5e5e"
                                    : "#293264",
                              },
                            }}
                            placeholder={{
                              label: "Select a difficulty...",
                              value: "any",
                            }}
                            onValueChange={(value) => setDifficulty(value)}
                            items={[
                              {
                                label: "Any",
                                value: "any",
                              },
                              {
                                label: "Easy",
                                value: "easy",
                              },
                              {
                                label: "Medium",
                                value: "medium",
                              },
                              {
                                label: "Hard",
                                value: "hard",
                              },
                            ]}
                          />
                        </Animated.View>
                      </Animated.View>
                    </View>
                  </TouchableWithoutFeedback>
                </Animated.View>
              </BlurView>
            </TouchableWithoutFeedback>
          ) : (
            //////////////////////STATS///////////////////////////////////
            <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
              <BlurView style={styles.modal} intensity={30} tint="light">
                <Animated.View
                  entering={FadeInDown.duration(500).delay(250)}
                  exiting={FadeOutUp.duration(500)}
                  style={styles.modal}
                  onPress={() => {
                    console.log("pressed");
                  }}
                >
                  <TouchableWithoutFeedback
                    style={[styles.stats, { borderWidth: 1 }]}
                    onPress={(e) => e.stopPropagation()}
                  >
                    <View style={[styles.stats]}>
                      <Animated.View
                        entering={FadeInUp.duration(500).delay(250)}
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <Animated.Text
                          entering={FadeInLeft.duration(500).delay(500)}
                          style={styles.wrongModalCount}
                        >
                          {props.wrong}
                        </Animated.Text>
                        <PieChart
                          style={{ marginLeft: 15, marginRight: 15 }}
                          widthAndHeight={chart_wh}
                          series={series}
                          sliceColor={sliceColor}
                          doughnut={true}
                          coverRadius={0.45}
                          coverFill={"#FFF"}
                        />
                        <Animated.Text
                          entering={FadeInRight.duration(500).delay(500)}
                          style={styles.rightModalCount}
                        >
                          {props.right}
                        </Animated.Text>
                      </Animated.View>
                      <View style={{ flexDirection: "row" }}>
                        <Animated.Text
                          entering={FadeInLeft.duration(500).delay(750)}
                          style={[styles.rightCount]}
                        >
                          Total:{" "}
                        </Animated.Text>
                        <Animated.Text
                          entering={FadeInRight.duration(500).delay(750)}
                          style={[
                            styles.rightCount,
                            { color: totalColor(total) },
                          ]}
                        >
                          {total}
                        </Animated.Text>
                      </View>
                      <Animated.Text
                        entering={FadeInDown.duration(500).delay(1000)}
                        style={styles.rightCount}
                      >
                        Accuracy:{" "}
                        <Animated.Text
                          style={[
                            styles.rightCount,
                            {
                              color: percentColor(percent * 100),
                            },
                          ]}
                        >
                          {Math.round(percent * 100)}
                        </Animated.Text>
                        <Text style={{ fontSize: 20 }}> %</Text>
                      </Animated.Text>
                    </View>
                  </TouchableWithoutFeedback>
                </Animated.View>
              </BlurView>
            </TouchableWithoutFeedback>
          )}
        </Modal>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={newQuiz}>
              <Text style={[styles.rightCount, { fontSize: 60 }]}>
                {" "}
                Quiz
                <LottieView
                  source={require("../assets/Animations/EXCLAMATION.json")}
                  style={{ width: 70, height: 70 }}
                  loop={false}
                  ref={animationRef4}
                />
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              flexDirection: "row",
              left: 0,
              right: 0,
              justifyContent: "space-around",
              marginBottom: 40,
            }}
          >
            <Animated.View
              entering={FadeInLeft.duration(500).delay(500)}
              style={{ alignItems: "center" }}
            >
              <TouchableOpacity onPress={openStats}>
                <LottieView
                  source={require("../assets/Animations/GRAPH.json")}
                  style={{ width: 40, height: 40 }}
                  ref={animationRef}
                  loop={false}
                />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              entering={FadeIn.duration(500).delay(750)}
              style={{ alignItems: "center" }}
            >
              <TouchableOpacity onPress={openAchievements}>
                <LottieView
                  source={require("../assets/Animations/MEDAL.json")}
                  style={{ width: 40, height: 40 }}
                  ref={animationRef2}
                  loop={false}
                />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              entering={FadeInRight.duration(500).delay(1000)}
              style={{ alignItems: "center" }}
            >
              <TouchableOpacity onPress={openSettings}>
                <LottieView
                  source={require("../assets/Animations/SETTINGS.json")}
                  style={{ width: 40, height: 40 }}
                  ref={animationRef3}
                  loop={false}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </ThirdwebProvider>
  );
}
