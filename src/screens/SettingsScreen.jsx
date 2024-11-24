import { View } from "react-native"
import Settings from "../components/Settings"
import MenuPanel from "../components/MenuPanel";

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Settings />
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

export default SettingsScreen;