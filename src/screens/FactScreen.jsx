import { View } from "react-native"
import Fact from "../components/Fact"

const FactScreen = ({ route }) => {
    const { fact } = route.params;

    return (
        <View style={styles.container}>
            <Fact fact = {fact} />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default FactScreen;