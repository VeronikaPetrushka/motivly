import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icons from "./Icons";

const { height } = Dimensions.get("window");

const Fact = ({ fact }) => {
  const navigation = useNavigation();
  const [isSaved, setIsSaved] = useState(false);

  const checkSavedState = async () => {
    try {
      const storedFacts = await AsyncStorage.getItem('pinned');
      if (storedFacts) {
        const parsedFacts = JSON.parse(storedFacts);
        const isFactSaved = parsedFacts.some((storedFact) => storedFact.title === fact.title);
        setIsSaved(isFactSaved);
      }
    } catch (error) {
      console.error("Error retrieving saved state:", error);
    }
  };

  const toggleSave = async () => {
    try {
      const storedFacts = await AsyncStorage.getItem('pinned');
      const parsedFacts = storedFacts ? JSON.parse(storedFacts) : [];

      if (isSaved) {
        const updatedFacts = parsedFacts.filter((storedFact) => storedFact.title !== fact.title);
        await AsyncStorage.setItem('pinned', JSON.stringify(updatedFacts));
        setIsSaved(false);
        Alert.alert("Unpinned", "Fact has been removed from your saved list.");
      } else {
        parsedFacts.push(fact);
        await AsyncStorage.setItem('pinned', JSON.stringify(parsedFacts));
        setIsSaved(true);
        Alert.alert("Pinned", "Fact has been saved to your list.");
      }
    } catch (error) {
      console.error("Error toggling save state:", error);
    }
  };

  useEffect(() => {
    checkSavedState();
  }, []);

  return (
    <ImageBackground source={require('../assets/back/5.png')} style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row"}}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Icons type={"back"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={toggleSave}>
            <Icons type={isSaved ? "saved" : "save"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ width: "100%" }}>
          {fact.title && <Text style={styles.title}>{fact.title}</Text>}

          {fact.description && <Text style={styles.description}>{fact.description}</Text>}

          {fact.subTitle && <Text style={styles.subTitle}>{fact.subTitle}</Text>}

          {fact.points && (
            <View style={styles.pointsContainer}>
              {fact.points.map((item, index) => (
                <View key={index} style={styles.pointItem}>
                  {item.point && <Text style={styles.pointTitle}>{item.point}</Text>}
                  {item.text && <Text style={styles.description}>{item.text}</Text>}

                  {item.list && (
                    <View style={styles.listContainer}>
                    {item.list.map((listItem, listIndex) => (
                      <Text key={listIndex} style={styles.listItem}>
                        - {listItem}
                      </Text>
                    ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {fact.conclusion && (
            <Text style={styles.conclusion}>
              <Text style={styles.conclusionBold}>Conclusion: </Text>
              {fact.conclusion}
            </Text>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: height * 0.12,
  },
  back: {
    width: 60,
    height: 60,
    padding: 10,
    position: "absolute",
    top: height * -0.07,
    left: 0,
    zIndex: 10,
  },
  save: {
    width: 60,
    height: 60,
    padding: 10,
    position: "absolute",
    top: height * -0.07,
    right: 0,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: '#6c1b45',
    marginTop: height * 0.03,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    marginBottom: 25,
    color: "#555",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#e75da5",
    textAlign: "center",
  },
  pointsContainer: {
    marginVertical: 10,
  },
  pointItem: {
    marginBottom: 10,
  },
  pointTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#be6392",
  },
  listItem: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  conclusion: {
    fontSize: 16,
    color: "#333",
  },
  conclusionBold: {
    fontWeight: "bold",
    color: '#e75da5'
  },
});

export default Fact;
