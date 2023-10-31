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
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

export default function StartScreen(props) {
  const animationRef = React.useRef(null);
  const [showModal, setShowModal] = React.useState(false);

  function openStats() {
    setShowModal((prev) => !prev);
    animationRef.current?.play();
  }

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
            <Animated.View
              entering={FadeInDown.duration(500).delay(250)}
              exiting={FadeOutUp.duration(500)}
              style={styles.modal}
            >
              <View style={{ height: 100 }}>
                <Text>Stats</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
        <TouchableOpacity onPress={props.newGame}>
          <Text style={[styles.rightCount, { fontSize: 40 }]}>
            {" "}
            Quiz <Text style={styles.emoji}>❗</Text>
          </Text>
        </TouchableOpacity>
        <View style={{ borderWidth: 1 }}>
          <TouchableOpacity onPress={openStats}>
            <LottieView
              source={require("../assets/Animations/GRAPH.json")}
              style={{ width: 25, height: 25 }}
              ref={animationRef}
              loop={false}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
