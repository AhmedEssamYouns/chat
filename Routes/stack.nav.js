import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { onSnapshot,doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { TouchableOpacity, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import TabNavigator from './tabs-nav';
import ChatConversationScreen from '../Pages/Screens/chat-room';
import SearchScreen from '../Pages/Screens/Search-screen';
import FriendsScreen from '../Pages/Screens/Frineds-screen';
import UserAccountScreen from '../Pages/Screens/user-account-screen';
import SettingMenu from '../Components/setting-menu';
import RotatingButton from '../Components/animated-rotate-button';
import HeaderRightIcons from '../Components/header-right-icons'; // Updated import
import SignUpScreen from '../Pages/Screens/sign-up';
import ForgetPasswordScreen from '../Pages/Screens/forget-password';
import ChangePasswordScreen from '../Pages/Screens/change-password';
import EditProfileScreen from '../Pages/Screens/edit-profile';
import SignInScreen from '../Pages/Screens/sign-in';
import { FIREBASE_AUTH } from '../firebase/config';
import { ActivityIndicator } from 'react-native';
import FriendRequestModal from '../Components/friends-requist-mode';

const Stack = createStackNavigator();

export default function MainTabNavigator() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    const [notificationCount, setNotificationCount] = useState(0);




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
    useEffect(() => {
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(user => {
            console.log('Auth state changed:', user ? 'Authenticated' : 'Not authenticated');
            setIsAuthenticated(!!user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);
    
    useEffect(() => {
        if (isAuthenticated) {
            const unsubscribe = onSnapshot(doc(db, 'users', FIREBASE_AUTH.currentUser.uid), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const newCount = data.friendRequestsReceived ? data.friendRequestsReceived.length : 0;
                    setNotificationCount(newCount);
                }
            });

            return unsubscribe;
        }
    }, [isAuthenticated]);
    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#f44336" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#121212' },
                    contentStyle: { backgroundColor: '#121212' },
                    cardStyle: { backgroundColor: '#121212' },
                }}>
                {isAuthenticated ? (
                    <>

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
                                    <HeaderRightIcons
                                        notificationCount={notificationCount}
                                        menuVisible={menuVisible}
                                        expanded={expanded}
                                        setMenuVisible={setMenuVisible}
                                        setExpanded={setExpanded}
                                        setModalVisible={setModalVisible} // Pass setModalVisible
                                    />
                                ),
                            }}
                        />
                        <Stack.Screen name='edit profile' component={EditProfileScreen} options={{
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
                        }} />
                        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
                        <Stack.Screen name='chat' component={ChatConversationScreen} options={{ headerShown: false }} />
                        <Stack.Screen name='search' component={SearchScreen} options={{ headerShown: false }} />
                        <Stack.Screen name='Friends' component={FriendsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name='account' component={UserAccountScreen} options={{
                          headerShown:false
                        }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>

            {/* Overlay to capture outside clicks */}
            {menuVisible && (
                <TouchableWithoutFeedback onPress={handleOutsidePress}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            <SettingMenu visible={menuVisible} onClose={handleMenuToggle} />
            <FriendRequestModal visible={modalVisible} onClose={() => setModalVisible(false)} />
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
        marginHorizontal: 10,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
});
