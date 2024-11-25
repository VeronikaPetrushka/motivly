import { View } from "react-native"
import Topics from "../components/Topics"
import MenuPanel from "../components/MenuPanel";

const TopicsScreen = ({route}) => {
    const { difficulty } = route.params;

    return (
        <View style={styles.container}>
            <Topics difficulty={difficulty} />
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

export default TopicsScreen;