import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Modal } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const Goal = () => {
    const navigation = useNavigation();
    const [totalScore, setTotalScore] = useState(0);
    const [isPurchased, setIsPurchased] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const storedScore = await AsyncStorage.getItem('totalScore');
                const storedPurchased = await AsyncStorage.getItem('isPurchased');
                if (storedScore) setTotalScore(parseInt(storedScore, 10));
                if (storedPurchased === 'true') setIsPurchased(true);
            } catch (error) {
                console.error("Error fetching stored state:", error);
            }
        };
        fetchState();
    }, []);

    const handleBuy = async () => {
        if (totalScore >= 2000) {
            try {
                const newScore = totalScore - 2000;
                setTotalScore(newScore);
                await AsyncStorage.setItem('totalScore', newScore.toString());
                setIsPurchased(true);
                await AsyncStorage.setItem('isPurchased', 'true');
                setShowModal(true);
            } catch (error) {
                console.error("Error saving purchase state:", error);
            }
        } else {
            alert('Not enough points to buy the complete guide.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a new goal</Text>

            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddGoalScreen')}>
                <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.guideBtn,
                    { backgroundColor: isPurchased ? '#4CAF50' : '#d3d3d3' }
                ]}
                onPress={() => navigation.navigate('GuideScreen')}
                disabled={!isPurchased}
            >
                <Text style={styles.guideBtnText}>The complete guide</Text>
            </TouchableOpacity>

            {!isPurchased && (
                <TouchableOpacity style={styles.buyBtn} onPress={handleBuy}>
                    <Text style={styles.buyBtnText}>2000</Text>
                </TouchableOpacity>
            )}

            <Modal
                transparent={true}
                visible={showModal}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Purchase successful!</Text>
                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.modalCloseBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
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
        marginBottom: height * 0.25,
        color: "#000",
    },
    addBtn: {
        padding: 30,
        width: height * 0.15,
        height: height * 0.15,
        borderRadius: 15,
        marginBottom: height * 0.2,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addBtnText: {
        fontWeight: '600',
        fontSize: 30,
    },
    guideBtn: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    guideBtnText: {
        fontSize: 18,
        color: '#fff',
    },
    buyBtn: {
        backgroundColor: '#FF5722',
        padding: 15,
        borderRadius: 10,
    },
    buyBtnText: {
        fontSize: 18,
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalCloseBtn: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    modalCloseBtnText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Goal;
