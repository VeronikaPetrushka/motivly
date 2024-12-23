import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Dimensions, ScrollView, ImageBackground } from "react-native";
import { useNavigation } from '@react-navigation/native';
import guide from "../constants/guide";
import Icons from "./Icons";

const { height } = Dimensions.get('window');

const Guide = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);

    const handleSelect = (item) => {
        setSelected(selected ? null : item);
    };

    return (
        <ImageBackground source={require('../assets/back/5.png')} style={{flex: 1}}>
            <View style={styles.container}>
                {selected ? (
                    <View style={styles.detailsContainer}>
                        <TouchableOpacity style={styles.back} onPress={() => setSelected(null)}>
                            <Icons type={"back"} />
                        </TouchableOpacity>

                        <ScrollView style={{marginTop: height * 0.07}}>
                            <Text style={styles.selectedTitle}>{selected.title}</Text>
                            <Text style={styles.selectedDescription}>{selected.description}</Text>
                            
                            {selected.points?.map((point, index) => (
                                <View key={index} style={styles.pointContainer}>
                                    <Text style={styles.pointTitle}>{point.subTitle}</Text>
                                    <Text style={styles.pointText}>{point.point}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                            <Icons type={"back"} />
                        </TouchableOpacity>

                        <Text style={styles.title}>The Complete Guide</Text>

                        <ScrollView>
                            {guide.map((item, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.guideBtn} 
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.guideBtnText}>{item.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                    </View>
                )}
            </View>
        </ImageBackground>
    );
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
    title: {
        fontWeight: "800",
        fontSize: 26,
        textAlign: "center",
        marginBottom: height * 0.03,
        color: "#e75da5",
    },
    guideBtn: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginBottom: height * 0.02,
        borderWidth: 1,
        borderColor: '#6c1b45'
    },
    guideBtnText: {
        fontSize: 18,
        color: '#6c1b45',
    },
    back: {
        width: 55,
        height: 55,
        padding: 10,
        position: "absolute",
        top: height * -0.02,
        left: -25,
        zIndex: 10,
    },
    detailsContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },
    selectedTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#6c1b45",
        textAlign: 'center'
    },
    selectedDescription: {
        fontSize: 16,
        marginBottom: 20,
        color: "#333",
        textAlign: 'justify'
    },
    pointContainer: {
        marginBottom: 15,
    },
    pointTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#e75da5",
    },
    pointText: {
        fontSize: 16,
        color: "#333",
        textAlign: 'justify'
    },
    listContainer: {
        width: '100%',
        alignItems: 'center',
    },
});

export default Guide;
