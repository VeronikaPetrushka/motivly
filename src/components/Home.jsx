import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import UserProfile from './UserProfile';
import AboutModal from './AboutModal';
// import DailyModal from './DailyModal';

const { height } = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation();
    const [aboutModalVisible, setAboutModalVisible] = useState(false);
    const [dailyModalVisible, setDailyModalVisible] = useState(true);
    const [userProfileModalVisible, setUserProfileModalVisible] = useState(false);
    const [uploadedImage, setUploadedImage] = useState({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
    const [userName, setUserName] = useState('');  

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
        }, [])
    );

      useEffect(() => {
        const interval = setInterval(() => {
            setDailyModalVisible(false);
            setTimeout(() => {
                setDailyModalVisible(true);
            }, 500);
        }, 86400000);

        return () => clearInterval(interval);
    }, []); 

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
                        <Text style={styles.name}>Hi, {userName || "User"}</Text>
                    </View>
            </TouchableOpacity>

            {/* <Image source={require('../assets/images/home.png')} style={styles.image} /> */}


            <View style={styles.btnContainer}>

            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('')}>
                <Text style={styles.btnTxt}>Unleash your potential</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('')}>
                <Text style={styles.btnTxt}>Results</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('')}>
                <Text style={styles.btnTxt}>Pinned</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => setAboutModalVisible(true)}>
                <Text style={styles.btnTxt}>About us</Text>
            </TouchableOpacity>

            </View>

            {/* <DailyModal visible={dailyModalVisible} onClose={() => setDailyModalVisible(false)} /> */}
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
    },

    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 7,
        // paddingHorizontal: 15,
        // borderRadius: 15,
        // backgroundColor: 'rgba(60, 60, 60, 0.55)',
        zIndex: 10,
        marginBottom: height * 0.05
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
        color: '#3C3C3C',
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
        justifyContent: 'space-between'
    },

    btn: {
        padding: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#fff',
        backgroundColor: '#8454ff',
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