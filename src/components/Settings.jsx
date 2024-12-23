import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Vibration, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMusic } from '../constants/music.js';
import Icons from './Icons.jsx';

const { height } = Dimensions.get('window');

const Settings = () => {
    const { isPlaying, togglePlay } = useMusic();
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedVibration = await AsyncStorage.getItem('vibrationEnabled');
                if (storedVibration !== null) {
                    setVibrationEnabled(JSON.parse(storedVibration));
                }
            } catch (error) {
                console.log('Error loading settings:', error);
            }
        };

        loadSettings();

    }, []);

    const handleToggleLoudness = async () => {
        togglePlay();
    };

    const handleToggleVibration = async () => {
        const newVibrationState = !vibrationEnabled;
        setVibrationEnabled(newVibrationState);

        try {
            await AsyncStorage.setItem('vibrationEnabled', JSON.stringify(newVibrationState));
            if (newVibrationState) {
                Vibration.vibrate();
            }
        } catch (error) {
            console.log('Error saving vibration setting:', error);
        }
    };

    const handleReset = async () => {
        try {
            await AsyncStorage.setItem('userProfile', "");
            await AsyncStorage.removeItem('uploadedImage');
            await AsyncStorage.removeItem('totalScore');
            await AsyncStorage.removeItem('lastClaimTime');
            await AsyncStorage.removeItem('bonusDay');
            await AsyncStorage.removeItem('goalsData');
            await AsyncStorage.removeItem('isPurchased');
            await AsyncStorage.removeItem('pinned');
            await AsyncStorage.removeItem('purchasedTopics');
            await AsyncStorage.removeItem('purchasedStories');

            setShowResetConfirmation(false);

            Alert.alert('Progress Reset', 'Your progress has been reset successfully!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') }
            ]);

            if (vibrationEnabled) {
                Vibration.vibrate();
            }
        } catch (error) {
            console.error('Error resetting progress:', error);
            Alert.alert('Error', 'There was a problem resetting your progress. Please try again later.');
        }
    };

    return (
        <ImageBackground source={require('../assets/back/5.png')} style={{flex: 1}}>
            <View style={styles.container}>
                {showResetConfirmation ? (
                    <>
                        <Text style={styles.confirmationText}>
                        Are you sure you want to reset your account? This action will delete your profile, including your user name, uploaded photo, score, articles, pinned, goal guide along with your set goals!
                        </Text>
                        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                            <Text style={styles.btnText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelReset} onPress={() => setShowResetConfirmation(false)}>
                            <Text style={styles.cancelBtnText}>Close</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>Settings</Text>

                        <View style={{height: height * 0.15}} />

                        <View style={styles.regulatorContainer}>
                            <View style={[{width: 60, height: 60}, !isPlaying && {opacity: 0.5}]}>
                                <Icons type={'music'} />
                            </View>
                            <Text style={[styles.toggleText, isPlaying ? styles.toggleTextOn : styles.toggleTextOff]}>
                                {isPlaying ? 'On' : 'Off'}
                            </Text>
                            <TouchableOpacity style={[styles.toggleContainer, isPlaying ? styles.toggleContainer : styles.toggleContainerOff]} onPress={handleToggleLoudness}>
                                <View style={[styles.toggle, isPlaying ? styles.toggleOn : styles.toggleOff]}></View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.regulatorContainer}>
                            <View style={[{width: 60, height: 60}, !vibrationEnabled && {opacity: 0.5}]}>
                                <Icons type={'vibration'} />
                            </View>
                            <Text style={[styles.toggleText, vibrationEnabled ? styles.toggleTextOn : styles.toggleTextOff]}>
                                {vibrationEnabled ? 'On' : 'Off'}
                            </Text>
                            <TouchableOpacity style={[styles.toggleContainer, vibrationEnabled ? styles.toggleContainer : styles.toggleContainerOff]} onPress={handleToggleVibration}>
                                <View style={[styles.toggle, vibrationEnabled ? styles.toggleOn : styles.toggleOff]}></View>
                            </TouchableOpacity>
                        </View>

                        <View style={{height: height * 0.11}} />

                        <TouchableOpacity style={styles.resetBtn} onPress={() => setShowResetConfirmation(true)}>
                            <Text style={styles.btnText}>Reset</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ImageBackground>
    );
};



const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 20,
        paddingTop: height * 0.08,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 34,
        textAlign: 'center',
        marginBottom: height * 0.11,
        color: '#6c1b45',
    },
    regulatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
        marginBottom: height * 0.04,
    },
    regulatorText: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#e460c3'
    },
    toggleContainer: {
        padding: 7,
        width: 100,
        height: 50,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#e460c3',
    },
    toggleContainerOff: {
        borderColor: '#8e7e8a',
    },
    toggleText: {
        fontSize: 16,
    },
    toggleTextOn: {
        color: '#e460c3',
    },
    toggleTextOff: {
        color: '#8e7e8a',
    },
    toggle: {
        borderRadius: 30,
        width: '45%',
        height: '100%',
    },
    toggleOn: {
        backgroundColor: '#e460c3',
        alignSelf: 'flex-end',
    },
    toggleOff: {
        backgroundColor: '#8e7e8a',
        alignSelf: 'flex-start',
    },
    btnText: {
        fontSize: 19,
        fontWeight: '500',
        color: 'white',
    },
    resetBtn: {
        width: '100%',
        backgroundColor: '#e75da5',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmationText: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: height * 0.1,
        marginTop: height * 0.15,
        color: '#5e0232'
    },
    cancelReset: {
        width: '100%',
        borderColor: '#e75da5',
        borderWidth: 2,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    cancelBtnText: {
        fontSize: 19,
        fontWeight: '500',
        color: '#e75da5',
    }
});

export default Settings;
