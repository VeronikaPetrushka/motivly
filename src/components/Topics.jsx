import React from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { useNavigation } from '@react-navigation/native';
import easy from "../constants/easy";
import peak from "../constants/peak";
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Topics = ({ difficulty }) => {
    const navigation = useNavigation();

    const handleNavigation = (item, difficulty) => {
        if (difficulty === 'easy') {
            navigation.navigate('EasyQuizScreen', { quiz: item });
        } else if (difficulty === 'peak') {
            navigation.navigate('PeakQuizScreen', { quiz: item });
        }
    };

    return (
        <ImageBackground source={require('../assets/back/5.png')} style={{flex: 1}}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Icons type={"back"} />
                </TouchableOpacity>

                <Text style={styles.title}>Topics</Text>

                <ScrollView style={{width: '100%'}}>
                    <View style={styles.btnContainer}>
                        {difficulty === 'easy' && easy.map((item, index) => (
                            <View key={index} style={{width: '100%', marginBottom: height * 0.04, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 12, paddingBottom: 15, height: height * 0.33, justifyContent: 'space-between'}}>
                                <TouchableOpacity style={styles.btn} onPress={() => handleNavigation(item, 'easy')}>
                                    <Image source={item.image} style={styles.image}/>
                                </TouchableOpacity>
                                <Text style={styles.btnText}>{item.topic}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <ScrollView style={{width: '100%'}}>
                    <View style={styles.btnContainer}>
                        {difficulty === 'peak' && peak.map((item, index) => (
                            <View key={index} style={{width: '100%', marginBottom: height * 0.04, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 12, paddingBottom: 15, height: height * 0.33, justifyContent: 'space-between'}}>
                                <TouchableOpacity style={styles.btn} onPress={() => handleNavigation(item, 'peak')}>
                                    <Image source={item.image} style={styles.image}/>
                                </TouchableOpacity>
                                <Text style={styles.btnText}>{item.topic}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 30,
      paddingTop: height * 0.07,
      paddingBottom: height * 0.12,
    },

    back: {
        width: 60,
        height: 60,
        padding: 10,
        position: "absolute",
        top: height * 0.04,
        left: 10,
        zIndex: 10,
    },

    title: {
      fontWeight: "bold",
      fontSize: 34,
      textAlign: "center",
      marginBottom: height * 0.04,
      color: "#e75da5",
    },

    btnContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },

    btn: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },

    image: {
        width: '100%',
        height: height * 0.25,
        resizeMode: 'cover',
    },

    btnText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#9d7ff7',
        textAlign: 'center'
    }
});

export default Topics;
