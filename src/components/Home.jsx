import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import UserProfile from './UserProfile';
import AboutModal from './AboutModal';
import DailyModal from './DailyModal';

const { height } = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation();
    const [aboutModalVisible, setAboutModalVisible] = useState(false);
    const [dailyModalVisible, setDailyModalVisible] = useState(false);
    const [userProfileModalVisible, setUserProfileModalVisible] = useState(false);
    const [uploadedImage, setUploadedImage] = useState({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
    const [userName, setUserName] = useState('');  
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [timeLeft, setTimeLeft] = useState('00:00:00');
    const [intervalId, setIntervalId] = useState(null);

    const loadAvatar = async () => {
        try {
          const storedImageUri = await AsyncStorage.getItem('uploadedImage');
            
          if (storedImageUri) {
            setUploadedImage(({ uri: storedImageUri }));
        } else {
            setUploadedImage({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
        }
        } catch (error) {
          console.error('Error loading avatar:', error);
        }
      };
    
      const loadName = async () => {
        try {
          const storedName = await AsyncStorage.getItem('userProfile');
          setUserName(storedName || '');
        } catch (error) {
          console.error('Error loading name:', error);
        }
      };
    
      useFocusEffect(
        useCallback(() => {
            loadAvatar();
            loadName();
            loadTimer();
        }, [])
    );

    const loadTimer = async () => {
        try {
          const lastClaimTime = await AsyncStorage.getItem('lastClaimTime');
          const currentTime = new Date().getTime();
          if (lastClaimTime) {
            const timeDifference = currentTime - parseInt(lastClaimTime);
            const timeRemaining = 86400000 - timeDifference;
            if (timeRemaining > 0) {
              setButtonDisabled(true);
              setTimeLeft(formatTime(timeRemaining));
              startCountdown(timeRemaining);
            } else {
              setButtonDisabled(false);
              setTimeLeft('00:00:00');
            }
          } else {
            setButtonDisabled(false);
            setTimeLeft('00:00:00');
          }
        } catch (error) {
          console.error('Error loading timer:', error);
        }
      };
    
      const startCountdown = (timeRemaining) => {
        if (intervalId) {
          clearInterval(intervalId);
        }
    
        const newIntervalId = setInterval(() => {
          if (timeRemaining <= 0) {
            clearInterval(newIntervalId);
            setButtonDisabled(false);
            setTimeLeft('00:00:00');
          } else {
            setTimeLeft(formatTime(timeRemaining));
            timeRemaining -= 1000;
          }
        }, 1000);
    
        setIntervalId(newIntervalId);
      };
    
      const formatTime = (milliseconds) => {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
      };
    
      const padTime = (time) => {
        return time < 10 ? `0${time}` : time;
      };
    
      const handleBonusPress = async () => {
        if (buttonDisabled) return;
    
        setDailyModalVisible(true);
        const currentTime = new Date().getTime();
        await AsyncStorage.setItem('lastClaimTime', currentTime.toString());
    
        setButtonDisabled(true);
        loadTimer();
      };

      useEffect(() => {
        return () => {
          if (intervalId) {
            clearInterval(intervalId);
          }
        };
      }, [intervalId]);

      const closeUserProfileModal = async () => {
        setUserProfileModalVisible(false);
        await loadAvatar();
        await loadName();
    };

    return(
        // <ImageBackground source={require('../assets/newDiz/back2.jpg')} style={{flex: 1}}>
        <View style={styles.container}>

            <TouchableOpacity style={styles.userContainer} onPress={() => setUserProfileModalVisible(true)}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={uploadedImage} 
                        style={styles.avatarImage}
                    />
                </View>
                    <View style={styles.nameBox}>
                        <Text style={styles.name}>Hi, {userName || "user"}</Text>
                    </View>
            </TouchableOpacity>

            <Image source={require('../assets/decor/1.png')} style={styles.image} />

            <TouchableOpacity style={[styles.btn, {width: '100%', marginBottom: height * 0.05}]} onPress={() => navigation.navigate('QuizModeScreen')}>
                <Text style={styles.btnTxt}>Unleash your potential</Text>
            </TouchableOpacity>

            <View style={styles.btnContainer}>

            <TouchableOpacity
                style={[styles.btn, buttonDisabled && {opacity: 0.6}]}
                onPress={handleBonusPress}
                disabled={buttonDisabled}
                >
                <Text style={styles.btnTxt}>
                    {buttonDisabled ? `${timeLeft}` : 'Daily bonus'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('PinnedScreen')}>
                <Text style={styles.btnTxt}>Pinned</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ResultsScreen')}>
                <Text style={styles.btnTxt}>Results</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => setAboutModalVisible(true)}>
                <Text style={styles.btnTxt}>About us</Text>
            </TouchableOpacity>

            </View>

            <DailyModal visible={dailyModalVisible} onClose={() => setDailyModalVisible(false)} />
            <UserProfile visible={userProfileModalVisible} onClose={closeUserProfileModal}/>
            <AboutModal visible={aboutModalVisible} onClose={() => setAboutModalVisible(false)}/>
        </View>
        // </ImageBackground>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 30,
        paddingTop: height * 0.07,
        backgroundColor: '#cfe2f3'
    },

    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 7,
        // paddingHorizontal: 15,
        // borderRadius: 15,
        // backgroundColor: 'rgba(60, 60, 60, 0.55)',
        zIndex: 10,
        marginBottom: height * 0.03
    },

    imageContainer: {
        padding: 0,
        width: height * 0.06,
        height: height * 0.06,
        alignItems: 'center',
        borderRadius: 100,
        overflow: 'hidden',
        marginRight: 10
    },

    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },

    // nameBox: {
    //     padding: 5, 
    //     borderRadius: 10, 
    //     backgroundColor: '#f9f9f9', 
    //     shadowColor: '#000',
    //     shadowOpacity: 0.2,
    //     shadowOffset: { width: 0, height: 5 },
    //     shadowRadius: 7,
    // },

    name: {
        fontSize: 22,
        fontWeight: '600',
        color: '#5c0432',
        textAlign: 'center'
    },

    image: {
        width: '100%',
        height: height * 0.3,
        resizeMode: 'cover',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: height * 0.05
    },

    title: {
        fontSize: 23,
        fontWeight: '700',
        color: '#FDF3E7',
        lineHeight: 23,
        textAlign: 'center',
        marginBottom: height * 0.02
    },

    btnContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    btn: {
        padding: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '47%',
        borderWidth: 0.5,
        borderColor: '#fff',
        backgroundColor: '#9d7ff7',
        borderRadius: 12,
        marginBottom: 10,
        zIndex: 10
    },

    btnTxt: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff'
    }
});

export default Home;