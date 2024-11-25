import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height, width } = Dimensions.get('window');

const Results = () => {
  const navigation = useNavigation();
  const [totalScore, setTotalScore] = useState(0);
  const [users, setUsers] = useState([]);

  const generateRandomName = () => {
    const firstNames = ['John', 'Jane', 'Alex', 'Chris', 'Taylor', 'Jordan', 'Sam', 'Avery', 'Casey', 'Morgan'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez', 'Davis', 'Miller', 'Wilson'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  };

  const generateUsers = () => {
    const generatedUsers = [];
    for (let i = 0; i < 10; i++) {
      const user = {
        name: generateRandomName(),
        score: Math.floor(Math.random() * (11500) + 500),
      };
      generatedUsers.push(user);
    }
    setUsers(generatedUsers);
  };

  useEffect(() => {
    const fetchTotalScore = async () => {
      const score = await AsyncStorage.getItem('totalScore');
      setTotalScore(score ? parseInt(score) : 0);
    };

    fetchTotalScore();
    generateUsers();
  }, []);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Look, I scored ${totalScore} points at 'Inspire life to win'! Can you beat my score? Join and find what inspires you !`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    // <ImageBackground source={require('../assets/newDiz/back1.jpg')} style={{flex: 1}}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Icons type={"back"} />
      </TouchableOpacity>
      <Text style={styles.totalScore}>{totalScore}</Text>
      
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userScore}>{item.score}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share Your Score</Text>
      </TouchableOpacity>
    </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        paddingTop: height * 0.07,
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
  totalScore: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6347',
    marginBottom: height * 0.03,
  },
  userContainer: {
    width: width * 0.85,
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A3D62',
  },
  userScore: {
    fontSize: 16,
    color: '#555',
  },
  shareButton: {
    width: 200,
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Results;
