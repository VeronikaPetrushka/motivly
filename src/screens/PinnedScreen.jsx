import { View } from "react-native"
import Pinned from "../components/Pinned"

const PinnedScreen = () => {
    return (
        <View style={styles.container}>
            <Pinned />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default PinnedScreen;