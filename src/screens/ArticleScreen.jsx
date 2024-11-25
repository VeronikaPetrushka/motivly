import { View } from "react-native"
import Article from "../components/Article"
import MenuPanel from "../components/MenuPanel";

const ArticleScreen = ({ route }) => {
    const { image, title, description, article } = route.params
    return (
        <View style={styles.container}>
            <Article
                image={image}
                title={title}
                description={description}
                article={article}
             />
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

export default ArticleScreen;