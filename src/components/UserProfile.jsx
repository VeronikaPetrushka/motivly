import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icons from './Icons.jsx';

const { height } = Dimensions.get('window');

const UserProfile = ({ visible, onClose }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(null);
  const [uploadedImage, setUploadedImage] = useState({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
  const [buttonText, setButtonText] = useState("Create account");
  const [errorName, setErrorName] = useState("");
  const [errorAge, setErrorAge] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userProfile');
        const storedImageUri = await AsyncStorage.getItem('uploadedImage');

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setName(parsedData.name);
          setAge(parsedData.age);
          setButtonText("Save changes");
        } else {
          setName("");
          setAge(null);
          setButtonText("Create");
        }

        if (storedImageUri) {
          setUploadedImage({ uri: storedImageUri });
        } else {
          setUploadedImage({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
        }

        setErrorName("");
        setErrorAge("");
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    if (visible) {
      loadProfile();
    }
  }, [visible]);

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleAgeChange = (text) => {
    setAge(text)
  };

  const handleSubmit = async () => {
    if (name.length > 13) {
      setErrorName("Name cannot exceed 13 characters.");
      return;
    }

    const numericAge = parseInt(age, 10);
    if (!numericAge || numericAge <= 0) {
        setErrorAge("Age must be a valid positive number.");
        return;
    }

    try {
        await AsyncStorage.setItem('userProfile', JSON.stringify({ name, age }));

      if (uploadedImage.uri) {
        await AsyncStorage.setItem('uploadedImage', uploadedImage.uri);
    }

      console.log('User profile saved successfully!');
      setButtonText("Save changes");
      onClose();
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const uploadImageFromLibrary = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
        } else {
          const imageUri = response.assets[0].uri;
          setUploadedImage({uri: imageUri});
        }
      }
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Icons type={'close'}/>
                </TouchableOpacity>

                <ScrollView style={{width: '100%'}}>
                <View style={styles.upperContainer}>
                  <Text style={styles.title}>Account</Text>
                  <View style={[styles.avatarPlaceholder, uploadedImage && styles.imagePlaceholder]}>
                      <Image source={uploadedImage} style={styles.uploadedAvatarImage} />
                  </View>
                  <TouchableOpacity style={styles.btnUploadImage} onPress={uploadImageFromLibrary}>
                    <Text style={styles.btnText}>Upload photo</Text>
                  </TouchableOpacity>

                    <View style={styles.inputContainer}>

                      <TextInput
                        value={name}
                        placeholder="Enter your name"
                        placeholderTextColor="#432887"
                        onChangeText={handleNameChange}
                        style={styles.input}
                      />
                      {errorName ? (
                        <Text style={styles.errorText}>{errorName}</Text>
                      ) : null}

                      <TextInput
                        value={age}
                        placeholder="Enter your age"
                        placeholderTextColor="#fa7fd9"
                        onChangeText={handleAgeChange}
                        style={styles.input}
                      />
                      {errorAge ? (
                        <Text style={styles.errorText}>{errorAge}</Text>
                      ) : null}

                      <TouchableOpacity style={styles.btnCreate} onPress={handleSubmit}>
                        <Text style={styles.btnCreateText}>{buttonText}</Text>
                      </TouchableOpacity>
                    </View>

                </View>
                <View style={{height: height * 0.05}}></View>
                </ScrollView>

              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};


const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    padding: 15,
    flexDirection: "column", 
    justifyContent: "flex-start",
    alignItems: "center",
    width: '90%',
    height: '53%',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  closeButton: {
    padding: 10,
    width: 40,
    height: 40,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10
  },
  upperContainer: {
    width: "100%",
    padding: 20,
    alignItems: "center"
  }, 

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: -15,
    color: '#432887'
  },

  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 100,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20
  },

  imagePlaceholder: {
    padding: 0
  },

  uploadedAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },

  inputContainer: {
    width: "100%",
    alignItems: 'center'
  },

  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#432887",
    borderRadius: 10,
    width: "100%",
    fontSize: 17,
    color: '#432887',
    marginBottom: 10
  },

  btnCreate: {
    width: "100%",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#8454ff',
    marginTop: 10
  },

  btnCreateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500'
  },

  btnText: {
    fontSize: 18,
    color: '#817a6e',
    fontWeight: '500'
  },

  btnUploadImage: {
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#817a6e',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20
  },

  errorText: {
    color: '#e1251b',
    fontSize: 14,
    position: 'absolute',
    top: 100
  }
};

export default UserProfile;