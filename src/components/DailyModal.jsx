import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const bonus = [
    {day: '1', amount: 100},
    {day: '2', amount: 500},
    {day: '3', amount: 1000},
    {day: '4', amount: 2000},
    {day: '5', amount: 3000},
]

const DailyModal = ({ visible, onClose }) => {
  const [currentBonus, setCurrentBonus] = useState(bonus[currentBonusIndex]);
  const [rewardMessage, setRewardMessage] = useState('');
  const [currentBonusIndex, setCurrentBonusIndex] = useState(0);

  const updateBonusDay = async () => {
    try {
      let storedBonusDay = await AsyncStorage.getItem('bonusDay');
      storedBonusDay = storedBonusDay ? parseInt(storedBonusDay) : 0;
      
      const nextBonusDay = storedBonusDay === bonus.length ? 1 : storedBonusDay + 1;
  
      await AsyncStorage.setItem('bonusDay', nextBonusDay.toString());
      setCurrentBonusIndex(nextBonusDay - 1);
    } catch (error) {
      console.error('Error updating bonus day:', error);
    }
  };
  

  useEffect(() => {
    if (!visible) return;
  
    const getBonusDay = async () => {
      try {
        const storedBonusDay = await AsyncStorage.getItem('bonusDay');
        if (storedBonusDay) {
          const bonusIndex = parseInt(storedBonusDay) - 1;
          setCurrentBonusIndex(bonusIndex >= 0 ? bonusIndex : 0);
        } else {
          setCurrentBonusIndex(0);
        }
      } catch (error) {
        console.error('Error loading bonus day:', error);
      }
    };
  
    getBonusDay();
  }, [visible]);
  
  useEffect(() => {
    if (!visible) return;
  
    const nextIndex = (currentBonusIndex + 1) % bonus.length;
    setCurrentBonusIndex(nextIndex);
    setCurrentBonus(bonus[nextIndex]);
  
    const updateScore = async () => {
      try {
        const storedScore = await AsyncStorage.getItem('totalScore');
        const currentScore = storedScore ? parseInt(storedScore, 10) : 0;
        const updatedScore = currentScore + bonus[nextIndex].amount;
  
        await AsyncStorage.setItem('totalScore', updatedScore.toString());
        setRewardMessage(
          `Receive your daily award of ${bonus[nextIndex].amount} points! Your total score is now ${updatedScore}.`
        );
  
        await updateBonusDay();
  
      } catch (error) {
        console.error('Error updating totalScore:', error);
      }
    };
  
    updateScore();
  }, [visible]);
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Daily Bonus</Text>
          {rewardMessage && (
            <Text style={styles.rewardMessage}>{rewardMessage}</Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icons type={'close'} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 15,
    textAlign: 'center',
    color: '#432887',
  },
  modalDescription: {
    fontSize: 17,
    textAlign: 'justify',
    marginBottom: 20,
  },
  rewardMessage: {
    fontSize: 16,
    color: '#FF6347',
    marginTop: 15,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    width: 42,
    height: 42,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default DailyModal;
