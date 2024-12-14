import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Modal, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icons from "./Icons";

const { height } = Dimensions.get("window");

const QuizMode = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setModalVisible(true);
  };

  const handleProceed = () => {
    setModalVisible(false);
    if (selectedMode === "easy") {
      navigation.navigate("TopicsScreen", { difficulty: "easy" });
    } else if (selectedMode === "peak") {
      navigation.navigate("TopicsScreen", { difficulty: "peak" });
    }
  };

  return (
    <ImageBackground source={require('../assets/back/5.png')} style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icons type={"back"} />
        </TouchableOpacity>
        <Text style={styles.title}>Quiz Mode</Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleModeSelect("easy")}
        >
          <Text style={styles.btnText}>First Step</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleModeSelect("peak")}
        >
          <Text style={styles.btnText}>Peak of success</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {selectedMode === "easy" ? "First Step" : "Peak of success"}
              </Text>

              <Text style={styles.modalText}>
                  {selectedMode === "easy"
                      ? "The First Step quiz features multiple-choice questions across 4 topics, with 15 questions per topic and 3 answer options. Each quiz has a time limit of 1 minute and 30 seconds, with 3 lives. You can purchase hints (3 types) and extra lives to aid your progress."
                      : "The Peak of success quiz consists of True/False questions across 4 topics, with 15 questions per topic. Each quiz has a time limit of 1 minute and 3 lives. Answering 3 consecutive questions correctly adds 30 seconds to your time. Like the First Step mode, you can purchase extra lives and 2 types of hints to assist you."
                  }
              </Text>


              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={handleProceed}
                >
                  <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 30,
    paddingTop: height * 0.07,
  },
  back: {
    width: 60,
    height: 60,
    padding: 10,
    position: "absolute",
    top: height * 0.04,
    left: 10,
    zIndex: 10,
},
  title: {
    fontWeight: "bold",
    fontSize: 34,
    textAlign: "center",
    marginBottom: height * 0.3,
    color: "#e75da5",
  },
  btn: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#fff",
    backgroundColor: "#9d7ff7",
    borderRadius: 12,
    marginBottom: 10,
    zIndex: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#432887",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 17,
    color: "#3C3C3C",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#CCCCCC",
    borderRadius: 10,
    marginRight: 10,
    flex: 1,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#000000",
    fontWeight: "bold",
  },
  proceedButton: {
    padding: 10,
    backgroundColor: "#e75da5",
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default QuizMode;
