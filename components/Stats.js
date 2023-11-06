import React from "react";
import { Modal } from "react-native";
import styles from "./Styles";

export default function Stats(props) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <Text>Stats</Text>
    </Modal>
  );
}
