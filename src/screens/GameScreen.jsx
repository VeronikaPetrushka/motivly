import { View } from "react-native"
import Game from "../components/Game"
import MenuPanel from "../components/MenuPanel";

const GameScreen = () => {
    return (
        <View style={styles.container}>
            <Game />
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

export default GameScreen;