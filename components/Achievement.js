import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  Modal,
} from "react-native";
import LottieView from "lottie-react-native";
import { styles } from "./Styles";
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  FadeInLeft,
  FadeOutLeft,
  FadeInRight,
} from "react-native-reanimated";

import { useContract, useAddress, useNFT } from "@thirdweb-dev/react-core";

export default function Achievement(props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const styleLocked =
    props.achievement.state === "locked"
      ? styles.achievementLocked
      : styles.achievementUnlocked;
  const { contract } = useContract(
    "0xD8445797679fF77E7AD457728B4169DdbEF88f30"
  );
  const address = useAddress();

  const { data: nft } = useNFT(contract, 0);
  const nftImage = nft?.metadata.image;

  return (
    <View style={styles.achievementContainer}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Animated.Text
          entering={FadeInUp.duration(500).delay(250)}
          style={styles.achievementTitle}
        >
          Achievements
        </Animated.Text>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Animated.View
            entering={FadeInRight.duration(500).delay(500)}
            exiting={FadeOutLeft.duration(500)}
            key={props.achievement.name}
          >
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#F5F7FB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 40,
                    right: 40,
                    zIndex: 100,
                  }}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 30 }}>X</Text>
                </TouchableOpacity>
                <Image
                  source={{ uri: nftImage?.toString() }}
                  style={{ width: 300, height: 300 }}
                />
                <Text>{nft?.metadata.name}</Text>
              </View>
            </Modal>
            <LottieView
              style={[styleLocked, { height: 150, width: 150 }]}
              source={props.achievement.image}
              autoPlay={props.achievement.state === "locked" ? false : true}
              loop={props.achievement.state === "locked" ? false : true}
            />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(500).delay(750)}
            style={styles.achievementDescription}
          >
            {props.achievement.description}
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
