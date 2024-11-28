import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

const { height } = Dimensions.get('window');

const AddGoal = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [successMeasure, setSuccessMeasure] = useState('');
  const [resources, setResources] = useState('');
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [category, setCategory] = useState('');
  const [dayOpen, setDayOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => ({
    label: `${(i + 1).toString().padStart(2, '0')}`,
    value: i + 1,
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `${(i + 1).toString().padStart(2, '0')}`,
    value: i + 1,
  }));

  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { label: `${year}`, value: year };
  });

  const isFutureDate = () => {
    if (!day || !month || !year) return false;
    const selectedDate = new Date(year, month - 1, day);
    return selectedDate > new Date();
  };

  const handleSubmit = async () => {
    const goalData = {
      title,
      goalInput,
      successMeasure,
      resources,
      date,
      category,
    };

    try {
      await AsyncStorage.setItem('goalData', JSON.stringify(goalData));
      Alert.alert('Success', 'Goal saved successfully!');
      navigation.navigate('GoalScreen')
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.title}>Goal title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your goal title"
              value={title}
              onChangeText={setTitle}
            />
            <TouchableOpacity
              style={[styles.nextButton, title && styles.activeButton]}
              disabled={!title}
              onPress={() => setStep(2)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.title}>Answer a few questions</Text>
            <TouchableOpacity
              style={[styles.nextButton, styles.activeButton]}
              onPress={() => setStep(3)}
            >
              <Text style={styles.buttonText}>Let's go!</Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={styles.title}>What do you want to achieve?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your goal"
              value={goalInput}
              onChangeText={setGoalInput}
            />
            <TouchableOpacity
              style={[styles.nextButton, goalInput && styles.activeButton]}
              disabled={!goalInput}
              onPress={() => setStep(4)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={styles.title}>How will you measure success?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your answer"
              value={successMeasure}
              onChangeText={setSuccessMeasure}
            />
            <TouchableOpacity
              style={[
                styles.nextButton,
                successMeasure && styles.activeButton,
              ]}
              disabled={!successMeasure}
              onPress={() => setStep(5)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      case 5:
        return (
          <View>
            <Text style={styles.title}>
              Do you have the resources/time for this?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your answer"
              value={resources}
              onChangeText={setResources}
            />
            <TouchableOpacity
              style={[styles.nextButton, resources && styles.activeButton]}
              disabled={!resources}
              onPress={() => setStep(6)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      case 6:
        return (
          <View>
            <Text style={styles.title}>When do you want to achieve this goal?</Text>
            <View style={styles.dropdownContainer}>
              <View style={{ width: '28%' }}>
                <DropDownPicker
                  open={dayOpen}
                  setOpen={setDayOpen}
                  value={day}
                  onChangeValue={(val) => setDay(val)}
                  items={days}
                  placeholder="Day"
                  style={styles.dropdown}
                />
              </View>
              <View style={{ width: '34%' }}>
                <DropDownPicker
                  open={monthOpen}
                  setOpen={setMonthOpen}
                  value={month}
                  onChangeValue={(val) => setMonth(val)}
                  items={months}
                  placeholder="Month"
                  style={styles.dropdown}
                />
              </View>
              <View style={{ width: '33%' }}>
                <DropDownPicker
                  open={yearOpen}
                  setOpen={setYearOpen}
                  value={year}
                  onChangeValue={(val) => setYear(val)}
                  items={years}
                  placeholder="Year"
                  style={styles.dropdown}
                />
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.nextButton,
                isFutureDate() && styles.activeButton,
              ]}
              disabled={!isFutureDate()}
              onPress={() => setStep(7)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      case 7:
        return (
          <View>
            <Text style={styles.title}>Select a category</Text>
            <View style={styles.categoryContainer}>
              {['Short term', 'Medium term', 'Long term'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.activeCategory,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.nextButton, category && styles.activeButton]}
              disabled={!category}
              onPress={() => setStep(8)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      case 8:
        return (
          <View>
            <Text style={styles.title}>Review Your Goal</Text>
            <Text>Title: {title}</Text>
            <Text>Goal: {goalInput}</Text>
            <Text>Measure of Success: {successMeasure}</Text>
            <Text>Resources: {resources}</Text>
            <Text>
              Target Date: {`${date.day}/${date.month}/${date.year}`}
            </Text>
            <Text>Category: {category}</Text>
            <TouchableOpacity
              style={[styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  nextButton: {
    backgroundColor: '#ccc',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activeCategory: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
});

export default AddGoal;
