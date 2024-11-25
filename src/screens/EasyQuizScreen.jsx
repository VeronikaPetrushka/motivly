import { View } from "react-native"
import EasyQuiz from "../components/EasyQuiz"

const EasyQuizScreen = ({ route }) => {
    const { quiz } = route.params;

    return (
        <View style={styles.container}>
            <EasyQuiz quiz = {quiz} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default EasyQuizScreen;