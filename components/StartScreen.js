import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "./Styles";
import LottieView from "lottie-react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import PieChart from "react-native-pie-chart";

export default function StartScreen(props) {
  const animationRef = React.useRef(null);
  const animationRef2 = React.useRef(null);
  const [showModal, setShowModal] = React.useState(false);

  function openStats() {
    setShowModal((prev) => !prev);
    animationRef.current?.play();
  }

  function openAchievements() {
    setShowModal((prev) => !prev);
    animationRef2.current?.play();
  }

  const chart_wh = 150;
  const series = [props.right, props.wrong];
  const sliceColor = ["#94D7A2", "#F8BCBC"];
  const total = props.right + props.wrong;

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

  //TODO:CREATE STATS PIE
  return (
    <View style={[styles.container, {}]}>
      <Animated.View
        entering={FadeInDown.duration(500).delay(250)}
        exiting={FadeOutUp.duration(500)}
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
          <TouchableWithoutFeedback onPress={openStats}>
            <BlurView style={styles.modal} intensity={95} tint="light">
              <Animated.View
                entering={FadeInDown.duration(500).delay(250)}
                exiting={FadeOutUp.duration(500)}
                style={styles.modal}
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
                      style={[styles.rightCount, { color: totalColor(total) }]}
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
                          color: percentColor(
                            (props.right / (props.right + props.wrong)) * 100
                          ),
                        },
                      ]}
                    >
                      {Math.round(
                        (props.right / (props.right + props.wrong)) * 100
                      )}
                    </Animated.Text>
                    <Text style={{ fontSize: 20 }}> %</Text>
                  </Animated.Text>
                </View>
              </Animated.View>
            </BlurView>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={props.newGame}>
              <Text style={[styles.rightCount, { fontSize: 40 }]}>
                {" "}
                Quiz <Text style={styles.emoji}>❗</Text>
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              width: 150,
              bottom: 0,
              marginBottom: "20%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={openStats}>
              <LottieView
                source={require("../assets/Animations/GRAPH.json")}
                style={{ width: 50, height: 50 }}
                ref={animationRef}
                loop={false}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openAchievements}>
              <LottieView
                source={require("../assets/Animations/MEDAL.json")}
                style={{ width: 50, height: 50 }}
                ref={animationRef2}
                loop={false}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
