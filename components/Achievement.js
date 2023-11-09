import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  Modal,
  TouchableWithoutFeedback,
  Alert,
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
  FadeIn,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Video } from "expo-av";
import {
  useContract,
  useAddress,
  useNFT,
  useMintNFT,
} from "@thirdweb-dev/react-core";
import { Web3Button } from "@thirdweb-dev/react-native";

const contractAddress = "0xD8445797679fF77E7AD457728B4169DdbEF88f30";

export default function Achievement(props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const styleLocked =
    props.achievement.state === "locked"
      ? styles.achievementLocked
      : styles.achievementUnlocked;
  const { contract } = useContract(contractAddress);
  const address = useAddress();

  const { data: nft, isLoading: isLoadingData } = useNFT(
    contract,
    props.achievementIndex + 1
  );
  console.log(nft);
  const nftImage = nft?.metadata.image;
  const { mutateAsync: mintNft, isLoading, error } = useMintNFT(contract);

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
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <BlurView style={styles.modal} intensity={30} tint="light">
                  <Animated.View
                    entering={FadeInUp.duration(1500).delay(250)}
                    exiting={FadeOutDown.duration(500)}
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
                        {isLoadingData ? (
                          <Animated.View
                            entering={FadeInUp.duration(500).delay(250)}
                            exiting={FadeOutDown.duration(500)}
                          >
                            <LottieView
                              style={{ width: 200 }}
                              source={require("../assets/Animations/CLOCK.json")}
                              autoPlay
                              loop
                            />
                          </Animated.View>
                        ) : (
                          <>
                            <Animated.Text
                              entering={FadeInUp.duration(500).delay(1500)}
                              style={[styles.achievementTitle]}
                            >
                              {nft?.metadata.name}
                            </Animated.Text>
                            <Animated.View
                              entering={FadeInLeft.duration(500).delay(2000)}
                            >
                              <Video
                                source={{ uri: nft?.metadata.animation_url }}
                                style={{
                                  width: 150,
                                  height: 150,
                                  borderRadius: 20,
                                }}
                                shouldPlay
                                isLooping
                              />
                            </Animated.View>
                            <Animated.Text
                              style={[
                                styles.achievementDescription,
                                { textAlign: "center", fontSize: 15 },
                              ]}
                              entering={FadeInRight.duration(500).delay(2500)}
                            >
                              {nft?.metadata.description}
                            </Animated.Text>
                            <Animated.View
                              entering={FadeInDown.duration(500).delay(3000)}
                            >
                              <Web3Button
                                contractAddress={contractAddress}
                                action={() => {
                                  mintNft({
                                    metadata: nft?.metadata,
                                    to: address,
                                  });
                                }}
                                isDisabled={
                                  props.achievement.state === "minted" ||
                                  props.achievement.state === "locked"
                                    ? true
                                    : false
                                }
                                onSuccess={() => {
                                  props.modifyAchievements(
                                    props.achievementIndex
                                  );
                                }}
                                onSubmit={() => {
                                  Alert.alert(
                                    "Minting NFT",
                                    "Please confirm the transaction in your wallet."
                                  );
                                }}
                              >
                                {props.achievement.state === "minted"
                                  ? "Minted"
                                  : props.achievement.state === "locked"
                                  ? "Locked"
                                  : "Mint"}
                              </Web3Button>
                            </Animated.View>
                          </>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  </Animated.View>
                </BlurView>
              </TouchableWithoutFeedback>
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
