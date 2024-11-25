import { View } from "react-native"
import PeakQuiz from "../components/PeakQuiz"

const PeakQuizScreen = ({ route }) => {
    const { quiz } = route.params;

    return (
        <View style={styles.container}>
            <PeakQuiz quiz = {quiz} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default PeakQuizScreen;