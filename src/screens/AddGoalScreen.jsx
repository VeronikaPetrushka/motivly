import { View } from "react-native"
import AddGoal from "../components/AddGoal"

const AddGoalScreen = () => {
    return (
        <View style={styles.container}>
            <AddGoal />
        </View>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    }
}

export default AddGoalScreen;