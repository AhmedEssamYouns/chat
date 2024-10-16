import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, TouchableWithoutFeedback, StyleSheet, Text } from 'react-native';
import ChatScreen from '../Pages/Main/home';
import StoriesScreen from '../Pages/Main/snaps';
import ProfileScreen from '../Pages/Main/profile';
import { AnimatedFloatingButton } from '../Components/Buttons/Floating-Button';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {
    const [isButtonExpanded, setIsButtonExpanded] = useState(false);

    const handleOutsidePress = () => {
        if (isButtonExpanded) {
            setIsButtonExpanded(false); 
        }
    };

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
                <Tab.Screen
                    name="chats"
                    component={ChatScreen}
                    options={{
                        tabBarLabel: ({ color }) => (
                            <View style={styles.labelContainer}>
                                <Text style={[styles.labelText, { color }]}>Chats</Text>
                            </View>
                        ),
                    }}
                />
                <Tab.Screen name="snaps" component={StoriesScreen} />
                <Tab.Screen name="profile" component={ProfileScreen} />
            </Tab.Navigator>

            {isButtonExpanded && (
                <TouchableWithoutFeedback onPress={handleOutsidePress}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            <AnimatedFloatingButton
                up={50}
                expanded={isButtonExpanded}
                setExpanded={setIsButtonExpanded}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 15,
    },
    badgeContainer: {
        backgroundColor: '#A8342A',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 6,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 20,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
