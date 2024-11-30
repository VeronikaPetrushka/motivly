import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView, StyleSheet, FlatList, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const ChampionQuiz = ({ quiz }) => {
  const navigation = useNavigation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [originalOptions, setOriginalOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [timer, setTimer] = useState(60);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showHints, setShowHints] = useState(false);
  const [showLives, setShowLives] = useState(false);
  const [hintsUsed, setHintsUsed] = useState({
    skip: false,
    showAnswer: false,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchTotalScore = async () => {
      const storedScore = await AsyncStorage.getItem('totalScore');
      if (storedScore) {
        setTotalScore(parseInt(storedScore, 10));
      }
    };
    fetchTotalScore();
  }, []);

  useEffect(() => {
    const initOptions = quiz.questions.map(q => q.options);
    setOriginalOptions(initOptions);
  }, [quiz]);  

  useEffect(() => {
    let timerInterval;
  
    if (!quizEnded && !showHints && !showLives) {
      timerInterval = setInterval(() => {
        if (timer > 0 && !quizEnded) {
          setTimer(timer - 1);
        } else {
          clearInterval(timerInterval);
          setQuizEnded(true);
        }
      }, 1000);
    }
  
    return () => clearInterval(timerInterval);
  }, [timer, quizEnded, showHints, showLives]);

  useEffect(() => {
    if (!showHints && !showLives) {
      setAnswered(false);
      setSelectedOption(null);
      setCorrectOption(null);
    }
  }, [showHints, showLives]);

  useEffect(() => {
    setHintsUsed({ skip: false, showAnswer: false });
  }, [currentQuestionIndex]);

  const handleOptionSelect = (option) => {
    if (answered || lives === 0 || quizEnded) return;
  
    setSelectedOption(option);
    setAnswered(true);
  
    if (option === quiz.questions[currentQuestionIndex].correct) {
      setCorrectOption(option);
      setScore(score + 100);
      setCorrectStreak(correctStreak + 1);
  
      if (correctStreak + 1 === 3) {
        setTimer((prev) => Math.min(prev + 30, 60));
        setCorrectStreak(0);
      }
    } else {
      setCorrectOption(quiz.questions[currentQuestionIndex].correct);
      setLives(lives - 1);
      setCorrectStreak(0);

      if (lives - 1 <= 0) {
        setTimeout(() => {
          setQuizEnded(true);
        }, 1000);
      }
    }
    
    if (lives < 1 || currentQuestionIndex === quiz.questions.length - 1) {
      setTimeout(() => {
        setQuizEnded(true);
      }, 1000);
    }

    setTimeout(() => {
      if (lives > 0 && !quizEnded) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      setAnswered(false);
      setSelectedOption(null);
      setCorrectOption(null);
    }, 1000);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleHintSelect = (type) => {
    if (type === 'skip') {
      setScore(score - 50);
      setHintsUsed((prev) => ({ ...prev, skip: true }));
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (type === 'showAnswer') {
      const question = quiz.questions[currentQuestionIndex];
      const wrongOptions = question.options.filter((opt) => opt !== question.correct);
      const optionToEliminate = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  
      question.options = question.options.filter((opt) => opt !== optionToEliminate);
  
      setScore(score - 75);
      setHintsUsed((prev) => ({ ...prev, showAnswer: true }));
    }
  
    setShowHints(false);
  };
  

  const handleLifePurchase = (amount) => {
    const lifePrices = { 1: 50, 2: 75, 3: 100 };
    const price = lifePrices[amount];

    if (score >= price && lives + amount <= 3) {
      setScore(score - price);
      setLives((prevLives) => Math.min(prevLives + amount, 3));
    }

    setShowLives(false);
  };

  const renderHints = () => {
    const hints = [
      { id: 'skip', text: 'Skip Question - 50 Points', price: 50 },
      { id: 'showAnswer', text: 'Show Answer - 75 Points', price: 75 },
    ];
  
    return (
      <View style={styles.hintsContainer}>
        <FlatList
          horizontal
          data={hints}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.hintCard, { opacity: score >= item.price ? 1 : 0.5 }]}
              onPress={() => score >= item.price && handleHintSelect(item.id)}
              disabled={score < item.price}
            >
              <View style={{width: height * 0.1, height: height * 0.1, marginBottom: height * 0.04}}>
                <Icons type={'hint'} />
              </View>
              <Text style={styles.hintText}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={() => setShowHints(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderLives = () => {
    const livesOptions = [
      { id: 1, text: '1 - 50 Points', price: 50 },
      { id: 2, text: '2 - 75 Points', price: 75 },
      { id: 3, text: '3 - 100 Points', price: 100 },
    ];
  
    return (
      <View style={styles.hintsContainer}>
        <FlatList
          horizontal
          data={livesOptions}
          keyExtractor={(_, index) => `life-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.hintCard,
                {
                  opacity: score >= item.price && lives + item.id <= 3 ? 1 : 0.5,
                  flexDirection: 'row'
                },
              ]}
              onPress={() => handleLifePurchase(item.id)}
              disabled={score < item.price || lives + item.id > 3}
            >
              <View style={{width: height * 0.1, height: height * 0.1, marginRight: 5}}>
                <Icons type={'heart'} />
              </View>
              <Text style={styles.hintText}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={() => setShowLives(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };  

  const renderQuestion = () => {
    const question = quiz.questions[currentQuestionIndex];
    const options = question.options;
  
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.question}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
          <Text style={styles.timer}>{score}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setShowLives(true)}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.heart}>
                <Icons type={index < lives ? 'heart' : 'heart-grey'} />
              </View>
            ))}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowHints(true)} style={styles.hint}>
            <Icons type="hint" />
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = option === selectedOption;
            const isCorrect = option === correctOption;
            const optionStyle = isSelected
              ? isCorrect
                ? styles.correctOption
                : styles.incorrectOption
              : isCorrect
              ? styles.correctOption
              : styles.option;
  
            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleOptionSelect(option)}
                disabled={answered}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (quizEnded) {
      const handleFinish = async () => {
        const newTotalScore = totalScore + score;
        setTotalScore(newTotalScore);
        
        await AsyncStorage.setItem('totalScore', newTotalScore.toString());
      };
      
      handleFinish();
    }
  }, [quizEnded]);

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswered(false);
    setSelectedOption(null);
    setCorrectOption(null);
    setLives(3);
    setScore(0);
    setTimer(60);
    setQuizEnded(false);
    setHintsUsed({ skip: false, showAnswer: false });
  
    quiz.questions.forEach((question, index) => {
      question.options = originalOptions[index];
    });
  };
  
  
  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderFinish = () => {

    return (
      <View style={styles.endMessageContainer}>
        <Text style={styles.endMessage}>Quiz Finished!</Text>
        <Text style={styles.endMessage}>Your final score is: {score}</Text>
        <Text style={styles.endMessage}>Total score: {totalScore}</Text>

        {quizEnded && (
        <>
          {lives === 0 || timer === 0 ? (
            <View style={{width: '100%', marginTop: height * 0.08}}>
              <Text style={styles.finishText}>Setbacks pave the way for comebacks!</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                  <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
                  <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : currentQuestionIndex === quiz.questions.length ? (
            <View style={{width: '100%', marginTop: height * 0.05}}>
              <Text style={styles.finishText}>You’re on the right track! Your determination is impressive. Let’s look ahead! Here’s wise words from great people!</Text>
              <TouchableOpacity style={styles.openButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Open</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.goBackSuccess} onPress={handleGoBack}>
                <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      )}
      </View>
    );
  };


  return (
    // <ImageBackground source={require('../assets/newDiz/back1.jpg')} style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.topic}>{quiz.topic}</Text>
      <Image source={quiz.image} style={styles.image} />
      {quizEnded ? renderFinish() : showHints ? (
        renderHints()
      ) : showLives ? (
        renderLives()
      ) : currentQuestionIndex < quiz.questions.length ? (
        renderQuestion()
      ) : (
        renderFinish()
      )}

      <Modal
            transparent={true}
            visible={modalVisible}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <ScrollView style={styles.ScrollView}>
                    <Text style={styles.title}>{quiz.title}</Text>
                    <Text style={[styles.modalText, {fontWeight: '700', marginBottom: 20, color: '#f57bbb'}]}>{quiz.quote}</Text>
                    <Text style={styles.modalText}>{quiz.description}</Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Icons type={'close'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
    // </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: height * 0.07,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#cfe2f3'
  },
  topic: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    color: '#e75da5',
  },
  timer: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    color: '#fc198f',
  },
  questionContainer: {
    marginBottom: height * 0.02,
    width: '100%'
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: height * 0.02,
    textAlign: 'center',
    color: '#6c1b45',
    height: 50
  },
  optionsContainer: {
    marginTop: 10,
    width: '100%'
  },
  option: {
    width: '100%',
    backgroundColor: '#8454ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700'
  },
  correctOption: {
    backgroundColor: 'green',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  incorrectOption: {
    backgroundColor: 'red',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  endMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  endMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c1b45',
  },
  heart: {
    width: 35,
    height: 35,
    marginRight: 1,
  },
  hint: {
    width: 35,
    height: 35,
  },
  hintsContainer: {
    height: '50%'
  },
  hintCard: {
    backgroundColor: '#000',
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.35
  },
  hintText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: height * 0.33,
    resizeMode: 'cover',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3C3C3C',
    marginBottom: height * 0.03,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 7,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    right: '30%'
  },
  closeButtonText: {
    color: '#000',
    fontWeight: '300',
    fontSize: 17
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  retryButton: {
    backgroundColor: '#8454ff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  goBackButton: {
    backgroundColor: '#432887',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
  },
  openButton: {
    backgroundColor: '#8454ff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  goBackSuccess: {
    backgroundColor: '#432887',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  finishText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#c72379',
    textAlign: 'center',
    marginBottom: height * 0.03,
    marginTop: height * -0.03
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
      width: '90%',
      height: '60%',
      padding: 20,
      paddingTop: 50,
      backgroundColor: 'white',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  modalText: {
      fontSize: 19,
      textAlign: 'center',
      color: '#3C3C3C'
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
    color: '#6c1b45',
    fontWeight: '800'
  },
  closeButton: {
      padding: 10,
      width: 42,
      height: 42,
      position: 'absolute',
      top: 10,
      right: 10,
  }
});

export default ChampionQuiz;
