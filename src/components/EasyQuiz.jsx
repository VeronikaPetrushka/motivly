import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const EasyQuiz = ({ quiz }) => {
  const navigation = useNavigation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(90);
  const [lives, setLives] = useState(3);
  const [hintsUsed, setHintsUsed] = useState({
    eliminate: false,
    answerTwice: false,
    skip: false,
  });
  const [hintsModalVisible, setHintsModalVisible] = useState(false);
  const [livesModalVisible, setLivesModalVisible] = useState(false);

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
    setCurrentOptions(initOptions[currentQuestionIndex]);
  }, [quiz, currentQuestionIndex]);
  

  useEffect(() => {
    let timerInterval;
  
    if (!quizEnded && !hintsModalVisible && !livesModalVisible) {
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
  }, [timer, quizEnded, hintsModalVisible, livesModalVisible]);

  useEffect(() => {
    if (!hintsModalVisible && !livesModalVisible) {
      setAnswered(false);
      setSelectedOption(null);
      setCorrectOption(null);
    }
  }, [hintsModalVisible, livesModalVisible]);

  useEffect(() => {
    setHintsUsed({ eliminate: false, answerTwice: false, skip: false });
  }, [currentQuestionIndex]);

  const handleOptionSelect = (option) => {
    if (answered || timer === 0 || lives === 0 || quizEnded) return;
  
    setSelectedOption(option);
  
    if (!hintsUsed.answerTwice || selectedOption) {
      setAnswered(true);
  
      if (option === quiz.questions[currentQuestionIndex].correct) {
        setCorrectOption(option);
        setScore(score + 100);
      } else {
        setCorrectOption(quiz.questions[currentQuestionIndex].correct);
        setLives(lives - 1);
  
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
    }
  };
  
  const handleHintSelect = (type) => {
    if (type === 'eliminate') {
      const question = quiz.questions[currentQuestionIndex];
      const wrongOptions = question.options.filter((opt) => opt !== question.correct);
  
      const optionToEliminate = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  
      const updatedOptions = question.options.filter((opt) => opt !== optionToEliminate);
  
      setCurrentOptions(updatedOptions);
  
      setScore(score - 25);
      setHintsUsed((prev) => ({ ...prev, eliminate: true }));
    } else if (type === 'answerTwice') {
      setScore(score - 50);
      setHintsUsed((prev) => ({ ...prev, answerTwice: true }));
    } else if (type === 'skip') {
      setScore(score - 75);
      setHintsUsed((prev) => ({ ...prev, skip: true }));
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  
    setHintsModalVisible(false);
  };  

  const handleLifePurchase = (amount) => {
    const lifePrices = { 1: 50, 2: 75, 3: 100 };
    const price = lifePrices[amount];

    if (score >= price && lives + amount <= 3) {
      setScore(score - price);
      setLives((prevLives) => Math.min(prevLives + amount, 3));
    }

    setLivesModalVisible(false);
  };

  const renderQuestion = () => {
    const question = quiz.questions[currentQuestionIndex];
    const options = currentOptions;

    return (
      <View style={styles.questionContainer}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.02 }}>

          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setLivesModalVisible(true)}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.heart}>
                <Icons type={index < lives ? 'heart' : 'heart-grey'} />
              </View>
            ))}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setHintsModalVisible(true)} style={styles.hint}>
            <Icons type="hint" />
          </TouchableOpacity>

          <Text style={styles.timer}>{formatTime(timer)}</Text>

          <Text style={styles.timer}>{score}</Text>

        </View>

        <Text style={styles.question}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = option === selectedOption;
            const isCorrect = option === correctOption;
            const optionStyle = isSelected
              ? isCorrect
                ? styles.correctOption
                : styles.incorrectOption
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

  const renderHintsModal = () => {
    const hints = [
      { id: 'eliminate', text: 'Eliminate 1 Option', price: 25 },
      { id: 'answerTwice', text: 'Answer Twice', price: 50 },
      { id: 'skip', text: 'Skip Question', price: 75 },
    ];
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={hintsModalVisible}
        onRequestClose={() => setHintsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Available Hints</Text>
            <ScrollView>
              {hints.map((hint) => (
                <View key={hint.id} style={styles.hintRow}>
                  <Text style={styles.modalText}>{hint.text} - {hint.price} Points</Text>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => {
                      if (score >= hint.price) {
                        handleHintSelect(hint.id);
                      } else {
                        Alert.alert('Not Enough Points', 'You do not have enough points to use this hint.');
                      }
                    }}
                  >
                    <Text style={styles.buyButtonText}>Buy</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setHintsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLivesModal = () => {
    const livesOptions = [
      { id: 1, text: '1 Life - 50 Points', price: 50 },
      { id: 2, text: '2 Lives - 75 Points', price: 75 },
      { id: 3, text: '3 Lives - 100 Points', price: 100 },
    ];
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={livesModalVisible}
        onRequestClose={() => setLivesModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Buy Lives</Text>
            <ScrollView>
              {livesOptions.map((option) => (
                <View key={option.id} style={styles.hintRow}>
                  <Text style={styles.modalText}>{option.text}</Text>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => {
                      if (score >= option.price) {
                        handleLifePurchase(option.id);
                      } else {
                        Alert.alert('Not Enough Points', 'You do not have enough points to buy this life.');
                      }
                    }}
                  >
                    <Text style={styles.buyButtonText}>Buy</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setLivesModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

    const initOptions = quiz.questions.map(q => q.options);
    setCurrentOptions(initOptions);
  
    quiz.questions.forEach((question, index) => {
      question.options = currentOptions[index];
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
            <View style={{width: '100%', marginTop: height * 0.03}}>
              <Text style={styles.finishText}>The path to greatness is never without obstacles</Text>

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
            <View style={{width: '100%', marginTop: height * 0.02}}>
              <Text style={styles.finishText}> A new success stage has emerged! Get ready for the next step.</Text>
              <TouchableOpacity 
                style={styles.openButton} 
                onPress={() => navigation.navigate('FactScreen', {
                    fact: quiz.fact,
                })}>
                <Text style={styles.buttonText}>Learn more</Text>
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <ImageBackground source={require('../assets/back/5.png')} style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.topic}>{quiz.topic}</Text>
        <Image source={quiz.image} style={styles.image} />
        
        {quizEnded ? (
          renderFinish()
          ) : (
            <>
              {hintsModalVisible && renderHintsModal()}

              {livesModalVisible && renderLivesModal()}

              {currentQuestionIndex < quiz.questions.length && renderQuestion()}
            </>
          )}

      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: height * 0.07,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    fontWeight: 'bold',
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
    marginBottom: height * 0.01,
    textAlign: 'center',
    color: '#6c1b45',
    height: 50
  },
  optionsContainer: {
    marginTop: 10,
  },
  option: {
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
    marginTop: 20,
  },
  endMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6c1b45',
  },
  heart: {
    width: 30,
    height: 30,
    marginRight: 3,
  },
  hint: {
    width: 40,
    height: 40,
  },
  hintsContainer: {
    height: '50%'
  },
  hintCard: {
    backgroundColor: '#fff',
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
    borderColor: '#6c1b45',
    marginBottom: height * 0.02,
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
    color: '#fff',
    fontWeight: '300',
    fontSize: 17
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02
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
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  goBackSuccess: {
    backgroundColor: '#432887',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  finishText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#c72379',
    textAlign: 'center',
    marginBottom: height * 0.06
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
      width: '90%',
      height: '40%',
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
    color: '#432887',
    fontWeight: '800'
  },
  closeBtn: {
      padding: 10,
      width: 42,
      height: 42,
      position: 'absolute',
      top: 10,
      right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 10,
  },
  buyButton: {
    backgroundColor: '#8454ff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'red',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#432887',
    textAlign: 'center',
    marginBottom: 10,
  },
  hintRow: {
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },  
});

export default EasyQuiz;
