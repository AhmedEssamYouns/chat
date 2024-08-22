import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import ChatScreen from '../Pages/Main/home';
import StoriesScreen from '../Pages/Main/stories';
import ProfileScreen from '../Pages/Main/profile';
import { AnimatedFloatingButton } from '../Components/Floating-Button';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {
    const [isButtonExpanded, setIsButtonExpanded] = useState(false);

    const handleOutsidePress = () => {
        if (isButtonExpanded) {
            setIsButtonExpanded(false); // Collapse the button when clicking outside
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
                <Tab.Screen name="chats" component={ChatScreen} />
                <Tab.Screen name="thoughts" component={StoriesScreen} />
                <Tab.Screen name="profile" component={ProfileScreen} />
            </Tab.Navigator>

            {/* Overlay to capture outside clicks */}
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
});
