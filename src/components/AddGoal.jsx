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
import Icons from './Icons';

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
  const [editingField, setEditingField] = useState(null);

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
    const date = {day: day, month: month, year: year}

    const newGoal = {
      title,
      goalInput,
      successMeasure,
      resources,
      date,
      category,
      completed: false
    };

    try {
      const existingGoals = await AsyncStorage.getItem('goalsData');
      let goalsArray = existingGoals ? JSON.parse(existingGoals) : [];

      goalsArray.push(newGoal);

      await AsyncStorage.setItem('goalsData', JSON.stringify(goalsArray));

      Alert.alert('Success', 'Goal saved successfully!');
      navigation.navigate('GoalScreen');
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
                  setValue={setDay}
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
                  setValue={setMonth}
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
                  setValue={setYear}
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
          
                <View style={styles.reviewField}>
                  <Text style={styles.label}>Title:</Text>
                  {editingField === 'title' ? (
                    <TextInput
                      style={styles.editInput}
                      value={title}
                      onChangeText={setTitle}
                    />
                  ) : (
                    <Text style={[styles.ellipsisText, {width: 280}]} numberOfLines={1}>{title}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      setEditingField(editingField === 'title' ? null : 'title')
                    }
                    style={styles.editButton}
                  >
                    <Text style={styles.editText}>
                      {editingField === 'title' ? 'Save' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
          
                <View style={styles.reviewField}>
                  <Text style={styles.label}>Goal:</Text>
                  {editingField === 'goal' ? (
                    <TextInput
                      style={styles.editInput}
                      value={goalInput}
                      onChangeText={setGoalInput}
                    />
                  ) : (
                    <Text style={[styles.ellipsisText, {width: 280}]} numberOfLines={1}>{goalInput}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      setEditingField(editingField === 'goal' ? null : 'goal')
                    }
                    style={styles.editButton}
                  >
                    <Text style={styles.editText}>
                      {editingField === 'goal' ? 'Save' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
          
                <View style={styles.reviewField}>
                  <Text style={[styles.label, editingField === 'successMeasure' && {width: 77}]}>Measure of Success:</Text>
                  {editingField === 'successMeasure' ? (
                    <TextInput
                      style={[styles.editInput, editingField === 'successMeasure' && {width: '57%'}]}
                      value={successMeasure}
                      onChangeText={setSuccessMeasure}
                    />
                  ) : (
                    <Text style={styles.ellipsisText} numberOfLines={1}>{successMeasure}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      setEditingField(editingField === 'successMeasure' ? null : 'successMeasure')
                    }
                    style={styles.editButton}
                  >
                    <Text style={styles.editText}>
                      {editingField === 'successMeasure' ? 'Save' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
          
                <View style={[styles.reviewField,  editingField === 'date' && {flexDirection: 'column'}]}>
                  <Text style={styles.label}>Target Date:</Text>
                  {editingField === 'date' ? (
                    <View style={styles.datePickerContainer}>
                        <View style={{width: '28%'}}>
                            <DropDownPicker
                            open={dayOpen}
                            setOpen={setDayOpen}
                            value={day}
                            setValue={setDay}
                            items={days}
                            placeholder="Day"
                            style={styles.dropdown}
                        />
                        </View>
                        <View style={{width: '34%'}}>
                            <DropDownPicker
                            open={monthOpen}
                            setOpen={setMonthOpen}
                            value={month}
                            setValue={setMonth}
                            items={months}
                            placeholder="Month"
                            style={styles.dropdown}
                        />
                        </View>
                        <View style={{width: '33%'}}>
                            <DropDownPicker
                            open={yearOpen}
                            setOpen={setYearOpen}
                            value={year}
                            setValue={setYear}
                            items={years}
                            placeholder="Year"
                            style={styles.dropdown}
                        />
                        </View>
                    </View>
                  ) : (
                    <Text style={{width: 230, textAlign: 'right'}}>{`${day}/${month}/${year}`}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => setEditingField(editingField === 'date' ? null : 'date')}
                    style={styles.editButton}
                  >
                    <Text style={styles.editText}>
                      {editingField === 'date' ? 'Save' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
          
                <View style={[styles.reviewField, editingField === 'category' && {flexDirection: 'column'}]}>
                  <Text style={[styles.label, editingField === 'category' && {marginBottom: 20}]}>Category:</Text>
                  {editingField === 'category' ? (
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
                  ) : (
                    <Text style={{width: 250, textAlign: 'right'}}>{category}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      setEditingField(editingField === 'category' ? null : 'category')
                    }
                    style={styles.editButton}
                  >
                    <Text style={styles.editText}>
                      {editingField === 'category' ? 'Save' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                </View>
          
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
          <Icons type={"back"} />
      </TouchableOpacity>
      {renderStep()}
    </View>
  );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#cfe2f3'
  },
  icon: {
    width: 60,
    height: 60,
    padding: 10,
    position: "absolute",
    top: height * 0.04,
    left: 10,
    zIndex: 10,
},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6c1b45',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6c1b45',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#6c1b45',
  },
  nextButton: {
    backgroundColor: '#e75da5',
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#e75da5',
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%'
  },
  categoryButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#6c1b45',
    borderRadius: 5,
  },
  activeCategory: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  reviewField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
  },
  ellipsisText: {
    width: 170,           
    overflow: 'hidden',   
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    textAlign: 'right'
  },
  editInput: {
    width: '65%',
    borderWidth: 1,
    borderColor: '#6c1b45',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  editButton: {
    padding: 5,
    backgroundColor: '#f99ed6',
    borderRadius: 5,
  },
  editText: {
    color: '#fff',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: height * 0.02
  },    
});

export default AddGoal;
