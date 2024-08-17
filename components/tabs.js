import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather,MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, Keyboard, View, Text, StyleSheet } from 'react-native';
import ChatScreen from '../MainPages/home';
import StoriesScreen from '../MainPages/stories';
import ProfileScreen from '../MainPages/profile';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
    const [keyboardVisible, setKeyboardVisible] = React.useState(false);

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: {
                    fontSize: 15,
                    textTransform: 'capitalize',
                },
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderBottomWidth: 1,
                    borderBottomColor: '#333',
                },
                tabBarIndicatorStyle: {
                    backgroundColor: 'white',
                    height: 3, // Adjust height of the indicator
                    borderRadius: 5, // Optional: Make the indicator rounded
                },
                tabBarOnPress: (e) => {
                    const tabName = route.name;
                    navigation.navigate(tabName, { scrollToTop: true });
                },
            })}
        >
            <Tab.Screen
                name="chats"
                component={ChatScreen}
            />
            <Tab.Screen
                name="thoughts"
                component={StoriesScreen}
            />
            <Tab.Screen
                name="profile"
                component={ProfileScreen}
            />
        </Tab.Navigator>
    );
}


export default function MainTabNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Tabs"
                component={TabNavigator}
                options={{
                    headerTitle: () => (
                        <Text style={styles.headerTitle}>Snap <Text style={{color:"tomato"}}>Talk</Text></Text>
                    ),
                    headerStyle: {
                        backgroundColor: '#121212',
                        elevation: 0, // Remove shadow on Android
                        shadowOpacity: 0, // Remove shadow on iOS
                        shadowOffset: { height: 0 }, // Remove shadow on iOS
                    },
                    headerTitleStyle: {
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 18,
                    },
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => console.log('Add user pressed')} style={styles.headerButton}>
                                <Feather name="user-plus" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Search pressed')} style={styles.headerButton}>
                                <Feather name="search" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('More options pressed')}>
                                <Feather name="more-vertical" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        color: 'white',
        fontFamily: 'title',
        fontSize: 18,
    },
    headerRight: {
        flexDirection: 'row',
        marginRight: 10,
    },
    headerButton: {
        marginRight: 15,
    },
});
