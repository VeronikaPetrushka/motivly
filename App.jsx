import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MusicProvider } from './src/constants/music';
import MusicPlayer from './src/components/MusicPlayer';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import QuizModeScreen from './src/screens/QuizModeScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import EasyQuizScreen from './src/screens/EasyQuizScreen';
import FactScreen from './src/screens/FactScreen';
import PinnedScreen from './src/screens/PinnedScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import PeakQuizScreen from './src/screens/PeakQuizScreen';
import StoriesScreen from './src/screens/StoriesScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import GoalScreen from './src/screens/GoalScreen';
import GuideScreen from './src/screens/GuideScreen';
import AddGoalScreen from './src/screens/AddGoalScreen';
import GameScreen from './src/screens/GameScreen';

enableScreens();

const Stack = createStackNavigator();


const App = () => {

    return (
        <MusicProvider>
            <MusicPlayer />
            <NavigationContainer>
                <Stack.Navigator initialRouteName="HomeScreen">
                    <Stack.Screen 
                        name="HomeScreen" 
                        component={HomeScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="SettingsScreen" 
                        component={SettingsScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="QuizModeScreen" 
                        component={QuizModeScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="TopicsScreen" 
                        component={TopicsScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="EasyQuizScreen" 
                        component={EasyQuizScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="FactScreen" 
                        component={FactScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="PinnedScreen" 
                        component={PinnedScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="ResultsScreen" 
                        component={ResultsScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="PeakQuizScreen" 
                        component={PeakQuizScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="StoriesScreen" 
                        component={StoriesScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="ArticleScreen" 
                        component={ArticleScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="GoalScreen" 
                        component={GoalScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="GuideScreen" 
                        component={GuideScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="AddGoalScreen" 
                        component={AddGoalScreen} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="GameScreen" 
                        component={GameScreen} 
                        options={{ headerShown: false }} 
                    />
                    </Stack.Navigator>
            </NavigationContainer>
        </MusicProvider>
    );
};

export default App;
