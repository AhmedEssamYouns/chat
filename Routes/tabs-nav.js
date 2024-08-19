import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Keyboard, View, Text, StyleSheet } from 'react-native';
import ChatScreen from '../Pages/Main/home';
import StoriesScreen from '../Pages/Main/stories';
import ProfileScreen from '../Pages/Main/profile';
import FloatingButton from '../Components/Floating-Button';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator({ navigation }) {

    return (
        <View style={{ flex: 1 }}>
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
                        height: 3,
                        borderRadius: 5,
                    },
                })}
            >
                <Tab.Screen name="chats" component={ChatScreen} />
                <Tab.Screen name="thoughts" component={StoriesScreen} />
                <Tab.Screen name="profile" component={ProfileScreen} />
            </Tab.Navigator>
            <FloatingButton onPress={() => console.log('Floating button pressed')} />
        </View>
    );
}
