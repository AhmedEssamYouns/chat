import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, Keyboard, View } from 'react-native';
import ChatScreen from '../MainPages/home';
import StoriesScreen from '../MainPages/stories';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator({ navigation }) {
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
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: "bold",
                    display: "none"
                },
                tabBarStyle: {
                    backgroundColor: '#121212', // Dark mode background color
                    borderTopWidth: 1,
                    borderTopColor: '#333', // Dark border color
                    display: keyboardVisible ? 'none' : 'flex'  // Hide tab bar when keyboard is visible
                },
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'SnapTalk') {
                        return <MaterialCommunityIcons name="comment-multiple-outline" size={size} color={color} />;

                    } else if (route.name === 'thoughts') {
                        return <MaterialCommunityIcons name="motion" size={size} color={color} />;
                    }
                    return <Feather name={iconName} size={size} color={color} />;
                },
            })}
        >
          
          <Tab.Screen 
                name="SnapTalk" 
                component={ChatScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#121212', 
                    },
                    headerTitleStyle: {
                        color: 'white', 
                    },
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', marginRight: 10 }}>
                            <TouchableOpacity onPress={() => console.log('Add user pressed')} style={{ marginRight: 15 }}>
                                <Feather name="user-plus" size={24} color="white" /> 
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Search pressed')} style={{ marginRight: 15 }}>
                                <Feather name="search" size={24} color="white" /> 
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('More options pressed')}>
                                <Feather name="more-vertical" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            
          <Tab.Screen 
                name="thoughts" 
                component={StoriesScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#121212', 
                    },
                    headerTitleStyle: {
                        color: 'white', 
                    },
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', marginRight: 10 }}>
                            <TouchableOpacity onPress={() => console.log('Add user pressed')} style={{ marginRight: 15 }}>
                                <Feather name="user-plus" size={24} color="white" /> 
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Search pressed')} style={{ marginRight: 15 }}>
                                <Feather name="search" size={24} color="white" /> 
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('More options pressed')}>
                                <Feather name="more-vertical" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
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
                    headerShown: false,
                }}
            />

        </Stack.Navigator>
    );
}
