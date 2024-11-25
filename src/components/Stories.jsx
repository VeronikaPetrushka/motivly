import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import stories from '../constants/stories';
import Icons from './Icons';

const { height, width } = Dimensions.get('window');

const Stories = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [purchasedTopics, setPurchasedTopics] = useState({});
  const [purchasedStories, setPurchasedStories] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const score = await AsyncStorage.getItem('totalScore');
      const storedTopics = await AsyncStorage.getItem('purchasedTopics');
      const storedStories = await AsyncStorage.getItem('purchasedStories');

      setTotalScore(score ? parseInt(score) : 0);
      setPurchasedTopics(storedTopics ? JSON.parse(storedTopics) : {});
      setPurchasedStories(storedStories ? JSON.parse(storedStories) : {});
    };

    fetchData();
  }, []);

  const handleBuy = async (index) => {
    if (totalScore < 2000) {
      Alert.alert('Insufficient Score', 'You do not have enough score to purchase this topic.');
      return;
    }

    const topic = stories[index];
    const newScore = totalScore - 2000;
    const updatedTopics = { ...purchasedTopics, [index]: topic };

    setTotalScore(newScore);
    setPurchasedTopics(updatedTopics);

    await AsyncStorage.setItem('totalScore', newScore.toString());
    await AsyncStorage.setItem('purchasedTopics', JSON.stringify(updatedTopics));
  };

  const handleBonusStory = async (index) => {
    const topic = stories[index];

    if (!purchasedStories[index]) {
      if (totalScore < 500) {
        Alert.alert('Insufficient Score', 'You do not have enough score to purchase this story.');
        return;
      }

      const newScore = totalScore - 500;
      const updatedStories = { ...purchasedStories, [index]: { storyName: topic.storyName, story: topic.story } };

      setTotalScore(newScore);
      setPurchasedStories(updatedStories);

      await AsyncStorage.setItem('totalScore', newScore.toString());
      await AsyncStorage.setItem('purchasedStories', JSON.stringify(updatedStories));
    }

    setSelectedStory({ storyName: topic.storyName, story: topic.story });
    setModalVisible(true);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % stories.length;
    setCurrentIndex(nextIndex);
    flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
  };

  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + stories.length) % stories.length;
    setCurrentIndex(prevIndex);
    flatListRef.current.scrollToIndex({ animated: true, index: prevIndex });
  };

  return (
<View style={styles.container}>
  <Text style={styles.scoreText}>{totalScore}</Text>

  <FlatList
    horizontal
    data={stories}
    renderItem={({ item, index }) => (
      <View style={{ alignItems: 'center' }}>
        <View style={styles.topicCard}>
          <Image source={item.image} style={styles.topicImage} />
          <Text style={styles.topicTitle}>{item.topic}</Text>

          <TouchableOpacity
            style={[
              styles.buyButton,
              totalScore < 2000 && { backgroundColor: '#d3d3d3' },
            ]}
            onPress={() => handleBuy(index)}
            disabled={!!purchasedTopics[index] || totalScore < 2000}
          >
            <Text style={styles.buyButtonText}>
              {purchasedTopics[index] ? 'Purchased' : 'Buy for 2000'}
            </Text>
          </TouchableOpacity>
        </View>
            <View style={{ width: width * 0.85, alignItems: 'center' }}>
              <ScrollView
                style={{ width: width * 0.85, maxHeight: height * 0.2 }}
                nestedScrollEnabled={true}
              >
                {purchasedTopics[index] &&
                  purchasedTopics[index].articles.map((article, idx) => (
                    <TouchableOpacity 
                        key={idx} 
                        style={styles.titleBtn} 
                        onPress={() => navigation.navigate('ArticleScreen', {
                        title: article.title,
                        description: article.description,
                        article: article.article,
                        image: article.image,
                    })}>
                      <Text style={styles.articleTitle}>{article.title}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>

      </View>
    )}
    keyExtractor={(item, index) => index.toString()}
    showsHorizontalScrollIndicator={false}
    ref={flatListRef}
    extraData={{ currentIndex, purchasedTopics, purchasedStories }}
  />

  <View style={styles.paginationContainer}>
    <TouchableOpacity
      onPress={goToPrevious}
      style={[styles.arrow, { transform: [{ rotate: '180deg' }] }]}
    >
      <Icons type={'arrow'} />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.centerBonusButton}
      onPress={() => handleBonusStory(currentIndex)}
    >
      <Text style={styles.centerBonusButtonText}>
        {purchasedStories[currentIndex] ? 'Read Story' : 'Bonus for 500'}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={goToNext} style={styles.arrow}>
      <Icons type={'arrow'} />
    </TouchableOpacity>
  </View>

  {selectedStory && (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedStory.storyName}</Text>
          <ScrollView>
            <Text style={styles.modalText}>{selectedStory.story}</Text>
          </ScrollView>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )}
</View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: height * 0.07,
    paddingBottom: height * 0.12,
  },
  scoreText: {
    color: '#FF6347',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: height * 0.02,
  },
  topicCard: {
    width: width * 0.85,
    height: height * 0.42,
    marginBottom: height * 0.03,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  topicImage: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 10,
    marginBottom: height * 0.03,
  },
  topicTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#432887',
    textAlign: 'center',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#FF6347',
    paddingVertical: height * 0.01,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  articleTitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: height * 0.02,
    paddingHorizontal: 20,
  },
  centerBonusButton: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  centerBonusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  arrow: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
    arrow: {
    width: 50,
    height: 50,
  },
  titleBtn: {
    padding: 5,
    backgroundColor: '#fff',
    marginBottom: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Stories;
