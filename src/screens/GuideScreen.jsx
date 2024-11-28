import { View } from "react-native"
import Guide from "../components/Guide"

const GuideScreen = () => {
    return (
        <View style={styles.container}>
            <Guide />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default GuideScreen;