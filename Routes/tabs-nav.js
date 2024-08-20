import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';
import ChatScreen from '../Pages/Main/home';
import StoriesScreen from '../Pages/Main/stories';
import ProfileScreen from '../Pages/Main/profile';
import { AnimatedFloatingButton } from '../Components/Floating-Button';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
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
                }}
            >
                <Tab.Screen name="chats" component={ChatScreen} />
                <Tab.Screen name="thoughts" component={StoriesScreen} />
                <Tab.Screen name="profile" component={ProfileScreen} />
            </Tab.Navigator>
            <AnimatedFloatingButton up={50} />
        </View>
    );
}
