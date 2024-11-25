import { View } from "react-native"
import Results from "../components/Results"

const ResultsScreen = () => {
    return (
        <View style={styles.container}>
            <Results />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default ResultsScreen;