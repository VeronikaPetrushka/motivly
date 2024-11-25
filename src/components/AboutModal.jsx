import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icons from './Icons';

const AboutModal = ({ visible, onClose }) => {

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <ScrollView style={styles.ScrollView}>
                    <Text style={styles.modalText}>
                    Welcome to <Text style={styles.bold}>Inspire life to win</Text> – your ultimate companion in unlocking the best version of yourself. This app is designed for individuals who are ready to take charge of their personal growth, achieve their goals, and embrace a journey of continuous improvement.
                    </Text>
                    <Text style={styles.modalText}>
                    At <Text style={styles.bold}>Inspire life to win,</Text> we combine the power of goal-setting with daily motivation to keep you inspired and on track. Whether you are striving for personal development, career success, or fitness goals, our app offers the tools you need to stay focused and achieve what you set out to do.
                    </Text>
                    <Text style={styles.modalText}>
                    Here’s what you can expect:
                    </Text>
                    <Text style={styles.modalText}>
                    Goal Setting: Use the SMART framework to create clear, actionable goals and break them down into manageable steps.
                    </Text>
                    <Text style={styles.modalText}>
                    Daily Motivation: Stay inspired with motivational quotes, success stories, and personalized messages that push you toward success.
                    </Text>
                    <Text style={styles.modalText}>
                    Interactive Features: Engage in fun quizzes, habit trackers, and challenges that keep you motivated and accountable.
                    </Text>
                    <Text style={styles.modalText}>
                    We believe in the power of a winning spirit – the inner drive to overcome challenges and rise above any obstacles. Our app is here to support you, offering tools, guidance, and encouragement to help you thrive on your path to success.
                    </Text>
                    <Text style={styles.modalText}>
                    Join us and start your journey today. The path to greatness is waiting, and your success story begins now!
                    </Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icons type={'close'}/>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        height: '60%',
        padding: 20,
        paddingTop: 50,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalText: {
        fontSize: 19,
        marginBottom: 10,
        textAlign: 'center',
        color: '#3C3C3C'
    },
    bold: {
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 10,
        width: 42,
        height: 42,
        position: 'absolute',
        top: 10,
        right: 10,
    }
});

export default AboutModal;
