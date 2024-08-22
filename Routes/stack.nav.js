import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import TabNavigator from './tabs-nav';
import ChatConversationScreen from '../Pages/Screens/chat-room';
import SearchScreen from '../Pages/Screens/Search-screen';
import FriendsScreen from '../Pages/Screens/Frineds-screen';
import UserAccountScreen from '../Pages/Screens/user-account-screen';
import SettingMenu from '../Components/setting-menu';
import RotatingButton from '../Components/animated-rotate-button';
import { useNavigation } from '@react-navigation/native';
import SignInScreen from '../Pages/Screens/auth/sign-in';
import SignUpScreen from '../Pages/Screens/auth/sign-up';
import ForgetPasswordScreen from '../Pages/Screens/auth/forget-password';
import ChangePasswordScreen from '../Pages/Screens/auth/change-password';
import EditProfileScreen from '../Pages/Screens/auth/edit-profile';

const Stack = createStackNavigator();

export default function MainTabNavigator() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleMenuToggle = () => {
        setMenuVisible(!menuVisible);
        setExpanded(!expanded);
    };

    const handleOutsidePress = () => {
        if (menuVisible) {
            setMenuVisible(false); // Collapse the menu when clicking outside
            setExpanded(false);
        }
    };

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#121212' },
                    contentStyle: { backgroundColor: '#121212' },
                    cardStyle: { backgroundColor: '#121212' },
                }}>
                <Stack.Screen
                    name="SignIn"
                    component={SignInScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ForgetPassword"
                    component={ForgetPasswordScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePasswordScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Tabs"
                    component={TabNavigator}
                    options={{
                        headerTitle: () => (
                            <Text style={styles.headerTitle}>Snap<Text style={{ color: "tomato" }}>Talk</Text></Text>
                        ),
                        headerStyle: {
                            backgroundColor: '#121212',
                            elevation: 0,
                            shadowOpacity: 0,
                            shadowOffset: { height: 0 },
                        },
                        headerTitleStyle: {
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 18,
                        },
                        headerRight: () => (
                            <View style={styles.headerRight}>
                                <TouchableOpacity onPress={() => navigation.navigate('search')} style={styles.headerButton}>
                                    <Feather name="search" size={24} color="white" />
                                </TouchableOpacity>
                                <RotatingButton
                                    size={60}
                                    backgroundColor={'#121212'}
                                    onPress={handleMenuToggle}
                                    icon={expanded ? 'x' : 'more-vertical'}
                                    expanded={expanded}
                                />

                            </View>
                        ),
                    }}
                />
                <Stack.Screen
                    name='chat'
                    component={ChatConversationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='search'
                    component={SearchScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Friends'
                    component={FriendsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='account'
                    component={UserAccountScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: '#121212',
                            elevation: 1,
                            shadowOpacity: 0,
                            shadowOffset: { height: 0 },
                        },
                        headerTitleStyle: {
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 18,
                        },
                        headerTintColor: "white"
                    }}
                />
                <Stack.Screen
                    name='edit profile'
                    component={EditProfileScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: '#121212',
                            elevation: 1,
                            shadowOpacity: 0,
                            shadowOffset: { height: 0 },
                        },
                        headerTitleStyle: {
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 18,
                        },
                        headerTintColor: "white"
                    }}
                />
            </Stack.Navigator>

            {/* Overlay to capture outside clicks */}
            {menuVisible && (
                <TouchableWithoutFeedback onPress={handleOutsidePress}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <SettingMenu visible={menuVisible} onClose={handleMenuToggle} />
        </View>
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
        position: 'relative',
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    menuContainer: {
        zIndex: 3000, // Ensure the menu is above the overlay
    },
});
