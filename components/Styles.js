import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // semi-transparent white
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
  questionContainer: {
    width: "80%",
    minHeight: "20%",
    height: "40%",
    justifyContent: "center",
    marginBottom: "2%",
  },
  answersContainer: {
    backgroundColor: "#F5F7FB",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quizContainer: {
    width: "100%",
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  answerRight: {
    backgroundColor: "#94D7A2",
    borderWidth: 0,
  },
  answerWrong: {
    backgroundColor: "#F8BCBC",
    opacity: 0.5,
    borderWidth: 0,
  },
  answerInactive: {
    opacity: 0.3,
  },
  questionText: {
    color: "#293264",
    fontFamily: "Karla-700",
  },
  answerText: {
    color: "#293264",
    fontFamily: "Inter-500",
  },
});
