import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Dimensions, ImageBackground } from 'react-native';
import game from '../constants/game';

const { height } = Dimensions.get('window');

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
            <View style={{width: '100%'}}>
                <Text style={styles.level}>Level {level}</Text>
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
                                    <Text style={styles.word}>{item.word}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
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
        setShuffledWords([]);
    };

    return (
        <ImageBackground source={require('../assets/back/5.png')} style={{flex: 1}}>
            <View style={styles.container}>
                {!gameCompleted ? (
                    <View style={{width: '100%', padding: 20}}>
                        {level === null ? (
                            <View style={{}}>
                                <Text style={styles.task}>Your task: Enhance concentration and positive thinking by assembling a goal from pieces while avoiding distractions.</Text>
                                <TouchableOpacity onPress={() => startLevel(1)} style={styles.levelButton}>
                                    <Text style={styles.levelButtonText}>Level 1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => startLevel(2)} style={styles.levelButton}>
                                    <Text style={styles.levelButtonText}>Level 2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => startLevel(3)} style={styles.levelButton}>
                                    <Text style={styles.levelButtonText}>Level 3</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => startLevel(4)} style={styles.levelButton}>
                                    <Text style={styles.levelButtonText}>Level 4</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                {renderWords()}
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={{width: '100%', padding: 20}}>
                        <ScrollView style={{width: '100%'}}>
                            {pressedPositive && (
                                <View style={[styles.phrasesContainer, pressedPositive && {backgroundColor: 'lightgreen'}]}>
                                    <Text style={[styles.phraseTitle, {color: '#274e13'}]}>Positive Phrases:</Text>
                                    {pressedPositive.map((word, index) => {
                                        const phrase = game.positive.find((item) => item.word === word)?.phrase || '';
                                        return <Text key={index} style={[styles.phrase, {color: '#38761d'}]}>- {phrase}</Text>;
                                    })}
                                </View>
                            )}
                            {pressedNegative && (
                                <View style={[styles.phrasesContainer, pressedPositive && {backgroundColor: 'lightcoral'}]}>
                                    <Text style={[styles.phraseTitle, {color: '#990000'}]}>Negative Phrases:</Text>
                                    {pressedNegative.map((word, index) => {
                                        const phrase = game.negative.find((item) => item.word === word)?.phrase || '';
                                        return <Text key={index} style={[styles.phrase, {color: '#ba0303'}]}>- {phrase}</Text>;
                                    })}
                                </View>
                            )}
                            {pressedBonus && (
                                <View style={[styles.phrasesContainer, pressedPositive && {backgroundColor: 'lightyellow'}]}>
                                    <Text style={[styles.phraseTitle, {color: '#bf9000'}]}>Bonus Phrases:</Text>
                                    {pressedBonus.map((word, index) => {
                                        const phrase = game.bonus.find((item) => item.word === word)?.phrase || '';
                                        return <Text key={index} style={[styles.phrase, {color: '#f1c232'}]}>- {phrase}</Text>;
                                    })}
                                </View>
                            )}
                        </ScrollView>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Text style={styles.backButtonText}>Go Back</Text>
                        </TouchableOpacity>
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
        padding: 0,
        paddingTop: height * 0.07,
    },
    task: {
        color: '#036081',
        fontSize: 22,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: height * 0.18,
        marginTop: height * 0.05
    },
    levelButton: {
        margin: 5,
        padding: 10,
        backgroundColor: '#9de3fc',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff'
    },
    levelButtonText: {
        color: '#0693c6',
        fontSize: 18,
        fontWeight: '800'
    },
    level: {
        color: '#6c1b45',
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: height * 0.05
    },
    wordsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    column: {
        alignItems: 'center',
    },
    wordButton: {
        marginHorizontal: 3,
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    word: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
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
    phrasesContainer: {
        width: '100%',
        padding: 10, 
        borderRadius: 10, 
        marginBottom: height * 0.015
    },
    phraseTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: height * 0.01
    },
    phrase: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: height * 0.01 
    },
    backButton: {
        marginTop: height * 0.02,
        padding: 10,
        backgroundColor: '#fc9bd7',
        borderRadius: 12,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
    }
});

export default Game;
