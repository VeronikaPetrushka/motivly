import { View } from "react-native"
import QuizMode from "../components/QuizMode"
import MenuPanel from "../components/MenuPanel";

const QuizModeScreen = () => {
    return (
        <View style={styles.container}>
            <QuizMode />
            <View style={styles.menu}>
                <MenuPanel />
            </View>
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },
    menu: {
        position: 'absolute',
        width: "100%",
        bottom: 0
    }
}

export default QuizModeScreen;