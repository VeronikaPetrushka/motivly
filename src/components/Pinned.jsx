import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icons from "./Icons";

const { height } = Dimensions.get('window');

const Pinned = () => {
  const [pinnedFacts, setPinnedFacts] = useState([]);
  const navigation = useNavigation();

  const fetchPinnedFacts = async () => {
    try {
      const storedFacts = await AsyncStorage.getItem('pinned');
      if (storedFacts) {
        setPinnedFacts(JSON.parse(storedFacts));
      } else {
        setPinnedFacts([]);
      }
    } catch (error) {
      console.error("Error fetching pinned facts:", error);
      Alert.alert("Error", "Could not retrieve pinned facts.");
    }
  };

  const removePinnedFact = async (factTitle) => {
    try {
      const updatedFacts = pinnedFacts.filter((fact) => fact.title !== factTitle);
      await AsyncStorage.setItem('pinned', JSON.stringify(updatedFacts));
      setPinnedFacts(updatedFacts);
      Alert.alert("Removed", "The fact has been removed from your pinned list.");
    } catch (error) {
      console.error("Error removing pinned fact:", error);
      Alert.alert("Error", "Could not remove the pinned fact.");
    }
  };

  useEffect(() => {
    fetchPinnedFacts();
  }, []);

  const renderFactItem = ({ item }) => (
    <View style={styles.factItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => navigation.navigate("FactScreen", { fact: item })}
        >
          <Text style={styles.buttonText}>Read More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removePinnedFact(item.title)}
        >
          <Icons type={'saved'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Icons type={"back"} />
      </TouchableOpacity>
      <Text style={styles.header}>Pinned Facts</Text>
      {pinnedFacts.length > 0 ? (
        <FlatList
          data={pinnedFacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFactItem}
        />
      ) : (
        <Text style={styles.emptyText}>No pinned facts found. Start saving your favorites!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: height * 0.07,
    backgroundColor: '#cfe2f3'
  },
  back: {
    width: 60,
    height: 60,
    padding: 10,
    position: "absolute",
    top: height * 0.04,
    left: 0,
    zIndex: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#e75da5'
  },
  factItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6c1b45",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  readMoreButton: {
    backgroundColor: "#ef90ff",
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  removeButton: {
    width: 40,
    height: 40
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 50,
  },
});

export default Pinned;
