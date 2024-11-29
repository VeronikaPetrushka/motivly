import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import game from '../constants/game';

const Game = () => {
    const [level, setLevel] = useState(null);
    const [pressedWords, setPressedWords] = useState([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [pressedPositive, setPressedPositive] = useState([]);
    const [pressedNegative, setPressedNegative] = useState([]);
    const [pressedBonus, setPressedBonus] = useState([]);
    const [selectionCount, setSelectionCount] = useState(0);

    const getRandomWords = (level) => {
        let selectedPositive = [];
        let selectedNegative = [];
        let selectedBonus = [];

        if (level === 1) {
            selectedPositive = game.positive.slice(0, 7);
            selectedNegative = game.negative.slice(0, 3);
        } else if (level === 2) {
            selectedPositive = game.positive.slice(0, 8);
            selectedNegative = game.negative.slice(0, 5);
            selectedBonus = game.bonus.slice(0, 2);
        } else if (level === 3) {
            selectedPositive = game.positive.slice(0, 9);
            selectedNegative = game.negative.slice(0, 8);
            selectedBonus = game.bonus.slice(0, 3);
        } else if (level === 4) {
            selectedPositive = game.positive.slice(0, 10);
            selectedNegative = game.negative.slice(0, 10);
            selectedBonus = game.bonus.slice(0, 3);
        }

        return { selectedPositive, selectedNegative, selectedBonus };
    };

    const getSelectionLimit = (level) => {
        switch (level) {
            case 1:
                return 5;
            case 2:
                return 7;
            case 3:
                return 9;
            case 4:
                return 10;
            default:
                return 0;
        }
    };

    const handlePress = (word, type) => {
        if (selectionCount >= getSelectionLimit(level)) {
            setGameCompleted(true);
            return;
        }

        if (type === 'positive') {
            setPressedPositive((prev) => [...prev, word]);
        } else if (type === 'negative') {
            setPressedNegative((prev) => [...prev, word]);
        } else {
            setPressedBonus((prev) => [...prev, word]);
        }
        setPressedWords((prev) => [...prev, word]);
        setSelectionCount((prev) => prev + 1);
    };

    const renderWords = () => {
        const { selectedPositive, selectedNegative, selectedBonus } = getRandomWords(level);
        return (
            <View style={styles.wordsContainer}>
                <View style={styles.column}>
                    {selectedPositive.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.wordButton,
                                pressedPositive.includes(item.word) && styles.greenButton
                            ]}
                            onPress={() => handlePress(item.word, 'positive')}
                            disabled={pressedWords.includes(item.word)}
                        >
                            <Text>{item.word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.column}>
                    {selectedNegative.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.wordButton,
                                pressedNegative.includes(item.word) && styles.redButton
                            ]}
                            onPress={() => handlePress(item.word, 'negative')}
                            disabled={pressedWords.includes(item.word)}
                        >
                            <Text>{item.word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.column}>
                    {selectedBonus.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.wordButton,
                                pressedBonus.includes(item.word) && styles.yellowButton
                            ]}
                            onPress={() => handlePress(item.word, 'bonus')}
                            disabled={pressedWords.includes(item.word)}
                        >
                            <Text>{item.word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    const handleBack = () => {
        setGameCompleted(false);
        setLevel(null);
        setPressedWords([]);
        setSelectionCount(0);
    };

    return (
        <View style={styles.container}>
            {!gameCompleted ? (
                <>
                    <Text>Your task: Enhance concentration and positive thinking by assembling a goal from pieces while avoiding distractions.</Text>
                    {level === null ? (
                        <>
                            <TouchableOpacity onPress={() => setLevel(1)} style={styles.levelButton}>
                                <Text>Level 1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setLevel(2)} style={styles.levelButton}>
                                <Text>Level 2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setLevel(3)} style={styles.levelButton}>
                                <Text>Level 3</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setLevel(4)} style={styles.levelButton}>
                                <Text>Level 4</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {renderWords()}
                        </>
                    )}
                </>
            ) : (
                <>
                    <Text>Positive Phrases:</Text>
                    {pressedPositive.map((word, index) => {
                        const phrase = game.positive.find((item) => item.word === word).phrase;
                        return <Text key={index}>{phrase}</Text>;
                    })}
                    <Text>Negative Phrases:</Text>
                    {pressedNegative.map((word, index) => {
                        const phrase = game.negative.find((item) => item.word === word).phrase;
                        return <Text key={index}>{phrase}</Text>;
                    })}
                    <Text>Bonus Phrases:</Text>
                    {pressedBonus.map((word, index) => {
                        const phrase = game.bonus.find((item) => item.word === word).phrase;
                        return <Text key={index}>{phrase}</Text>;
                    })}
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text>Go Back</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    levelButton: {
        margin: 10,
        padding: 10,
        backgroundColor: 'lightblue',
        borderRadius: 5
    },
    finishButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'grey',
        borderRadius: 5
    },
    wordsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    column: {
        flex: 1
    },
    columnTitle: {
        fontWeight: 'bold',
        marginBottom: 10
    },
    wordButton: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'lightgrey',
        borderRadius: 5
    },
    greenButton: {
        backgroundColor: 'green'
    },
    redButton: {
        backgroundColor: 'red'
    },
    yellowButton: {
        backgroundColor: 'yellow'
    }
});

export default Game;
