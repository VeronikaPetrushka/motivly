import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import game from '../constants/game';

const Game = () => {
    const [level, setLevel] = useState(null);
    const [shuffledWords, setShuffledWords] = useState([]);
    const [pressedWords, setPressedWords] = useState([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [pressedPositive, setPressedPositive] = useState([]);
    const [pressedNegative, setPressedNegative] = useState([]);
    const [pressedBonus, setPressedBonus] = useState([]);
    const [selectionCount, setSelectionCount] = useState(0);

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

    const startLevel = (level) => {
        setLevel(level);

        setPressedWords([]);
        setPressedPositive([]);
        setPressedNegative([]);
        setPressedBonus([]);
        setSelectionCount(0);

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

        const allWords = [
            ...selectedPositive.map((word) => ({ ...word, type: 'positive' })),
            ...selectedNegative.map((word) => ({ ...word, type: 'negative' })),
            ...selectedBonus.map((word) => ({ ...word, type: 'bonus' }))
        ];

        for (let i = allWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
        }

        setShuffledWords(allWords);
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
        const columnCount = 3;
        const columnLength = Math.ceil(shuffledWords.length / columnCount);

        const columns = Array.from({ length: columnCount }, (_, index) =>
            shuffledWords.slice(index * columnLength, (index + 1) * columnLength)
        );

        return (
            <View style={styles.wordsContainer}>
                {columns.map((columnWords, columnIndex) => (
                    <View key={columnIndex} style={styles.column}>
                        {columnWords.map((item, wordIndex) => (
                            <TouchableOpacity
                                key={wordIndex}
                                style={[
                                    styles.wordButton,
                                    pressedPositive.includes(item.word) && styles.greenButton,
                                    pressedNegative.includes(item.word) && styles.redButton,
                                    pressedBonus.includes(item.word) && styles.yellowButton,
                                ]}
                                onPress={() => handlePress(item.word, item.type)}
                                disabled={pressedWords.includes(item.word)}
                            >
                                <Text>{item.word}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    const handleBack = () => {
        setGameCompleted(false);
        setLevel(null);
        setPressedWords([]);
        setSelectionCount(0);
        setShuffledWords([]);
    };

    return (
        <View style={styles.container}>
            {!gameCompleted ? (
                <>
                    <Text>Your task: Enhance concentration and positive thinking by assembling a goal from pieces while avoiding distractions.</Text>
                    {level === null ? (
                        <>
                            <TouchableOpacity onPress={() => startLevel(1)} style={styles.levelButton}>
                                <Text>Level 1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => startLevel(2)} style={styles.levelButton}>
                                <Text>Level 2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => startLevel(3)} style={styles.levelButton}>
                                <Text>Level 3</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => startLevel(4)} style={styles.levelButton}>
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
                    {pressedPositive && (
                        <View>
                            <Text>Positive Phrases:</Text>
                            {pressedPositive.map((word, index) => {
                                const phrase = game.positive.find((item) => item.word === word)?.phrase || '';
                                return <Text key={index}>{phrase}</Text>;
                            })}
                        </View>
                    )}
                    {pressedNegative && (
                        <View>
                            <Text>Negative Phrases:</Text>
                            {pressedNegative.map((word, index) => {
                                const phrase = game.negative.find((item) => item.word === word)?.phrase || '';
                                return <Text key={index}>{phrase}</Text>;
                            })}
                        </View>
                    )}
                    {pressedBonus && (
                        <View>
                            <Text>Bonus Phrases:</Text>
                            {pressedBonus.map((word, index) => {
                                const phrase = game.bonus.find((item) => item.word === word)?.phrase || '';
                                return <Text key={index}>{phrase}</Text>;
                            })}
                        </View>
                    )}
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
        padding: 20,
    },
    levelButton: {
        margin: 10,
        padding: 10,
        backgroundColor: 'lightblue',
        borderRadius: 5,
    },
    wordsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    wordButton: {
        margin: 5,
        padding: 10,
        backgroundColor: 'lightgray',
        borderRadius: 5,
    },
    greenButton: {
        backgroundColor: 'lightgreen',
    },
    redButton: {
        backgroundColor: 'lightcoral',
    },
    yellowButton: {
        backgroundColor: 'lightyellow',
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default Game;
