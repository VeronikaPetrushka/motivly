import { View } from "react-native"
import Stories from "../components/Stories"
import MenuPanel from "../components/MenuPanel";

const StoriesScreen = () => {
    return (
        <View style={styles.container}>
            <Stories />
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

export default StoriesScreen;