import { View } from "react-native"
import Goal from "../components/Goal"
import MenuPanel from "../components/MenuPanel";

const GoalScreen = () => {
    return (
        <View style={styles.container}>
            <Goal />
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

export default GoalScreen;