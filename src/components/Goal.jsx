import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Modal, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const Goal = () => {
    const navigation = useNavigation();
    const [totalScore, setTotalScore] = useState(0);
    const [isPurchased, setIsPurchased] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);


    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const storedGoals = await AsyncStorage.getItem('goalsData');
                if (storedGoals) {
                    setGoals(JSON.parse(storedGoals));
                }
            } catch (error) {
                console.error("Error fetching goals:", error);
            }
        };
        fetchGoals();
    }, []);

    console.log('Goals: ', goals)

    const openDetailsModal = (goal) => {
        setSelectedGoal(goal);
        setShowDetailsModal(true);
    };

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

    const deleteGoal = async () => {
        try {
            const updatedGoals = goals.filter((goal) => goal !== goalToDelete);
            setGoals(updatedGoals);
            await AsyncStorage.setItem('goalsData', JSON.stringify(updatedGoals));
            setShowConfirmModal(false);
        } catch (error) {
            console.error("Error deleting goal:", error);
        }
    };    

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a new goal</Text>

            <FlatList
                data={goals}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={[styles.goalCard, item.completed && {borderColor: 'green'}]}>
                        <Text style={styles.goalTitle}>{item.title}</Text>
                        <Text style={styles.goalDate}>
                            {item.date?.day}/{item.date?.month}/{item.date?.year}
                        </Text>
                        <TouchableOpacity
                            style={styles.detailsBtn}
                            onPress={() => openDetailsModal(item)}
                        >
                            <Text style={styles.detailsBtnText}>Details</Text>
                        </TouchableOpacity>
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <TouchableOpacity
                                style={[
                                    styles.toolBtn,
                                    { backgroundColor: item.completed ? '#FFC107' : 'blue' }
                                ]}
                                onPress={async () => {
                                    const updatedGoals = goals.map((goal) =>
                                        goal === item ? { ...goal, completed: !goal.completed } : goal
                                    );
                                    setGoals(updatedGoals);
                                    try {
                                        await AsyncStorage.setItem('goalsData', JSON.stringify(updatedGoals));
                                    } catch (error) {
                                        console.error("Error updating goal:", error);
                                    }
                                }}
                            >
                                <Text style={styles.toolBtnText}>
                                    {item.completed ? 'Unmark' : 'Mark as completed'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toolBtn, {width: 90}]}
                                onPress={() => {
                                    setGoalToDelete(item);
                                    setShowConfirmModal(true);
                                }}
                            >
                                <Text style={styles.toolBtnText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={styles.pagination}>
                {goals.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

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
                visible={showDetailsModal}
                animationType="fade"
                onRequestClose={() => setShowDetailsModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedGoal && (
                            <>
                                <Text style={styles.modalText}>Title: {selectedGoal.title}</Text>
                                <Text style={styles.modalText}>Date: {selectedGoal.date.day}/{selectedGoal.date.month}/{selectedGoal.date.year}</Text>
                                <Text style={styles.modalText}>Goal: {selectedGoal.goalInput}</Text>
                                <Text style={styles.modalText}>Success Measure: {selectedGoal.successMeasure}</Text>
                                <Text style={styles.modalText}>Resources: {selectedGoal.resources}</Text>
                                <Text style={styles.modalText}>Category: {selectedGoal.category}</Text>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setShowDetailsModal(false)}
                        >
                            <Text style={styles.modalCloseBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent={true}
                visible={showModal}
                animationType="fade"
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

            <Modal
                transparent={true}
                visible={showConfirmModal}
                animationType="fade"
                onRequestClose={() => setShowConfirmModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete this goal?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <TouchableOpacity
                                style={[styles.modalCloseBtn, { backgroundColor: 'red' }]}
                                onPress={deleteGoal}
                            >
                                <Text style={styles.modalCloseBtnText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalCloseBtn}
                                onPress={() => setShowConfirmModal(false)}
                            >
                                <Text style={styles.modalCloseBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingBottom: height * 0.12
    },
    title: {
        fontWeight: "800",
        fontSize: 26,
        textAlign: "center",
        marginBottom: height * 0.02,
        color: "#000",
    },
    list: {
        alignItems: 'center',
        marginTop: height * -0.025,
        height: height * 0.35
    },
    goalCard: {
        width: width * 0.82,
        backgroundColor: '#f5f5f5',
        borderRadius: 15,
        marginHorizontal: width * 0.01,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 1,
    },
    goalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    goalDate: {
        fontSize: 16,
        marginBottom: 10,
    },
    detailsBtn: {
        backgroundColor: '#4CAF50',
        padding: 5,
        borderRadius: 10,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    detailsBtnText: {
        color: '#fff',
        fontSize: 16,
    },
    toolBtn: {
        backgroundColor: 'blue',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 180
    },
    toolBtnText: {
        color: '#fff',
        fontSize: 15,
    },
    pagination: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
        position: 'absolute',
        top: height * 0.43
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#d3d3d3',
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: '#4CAF50',
        width: 15,
        height: 15,
    },
    addBtn: {
        padding: 30,
        width: height * 0.15,
        height: height * 0.15,
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.03
    },
    addBtnText: {
        fontWeight: '600',
        fontSize: 30,
    },
    guideBtn: {
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    guideBtnText: {
        fontWeight: '800',
        fontSize: 16,
        color: '#fff'
    },
    buyBtn: {
        backgroundColor: '#FF5722',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center'

    },
    buyBtnText: {
        fontWeight: '800',
        fontSize: 16,
        color: '#fff'
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
