import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { TouchableWithoutFeedback, View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import TabNavigator from './tabs-nav';
import ChatConversationScreen from '../Components/chat/chat-room';
import SearchScreen from '../Pages/menu-screens/Search-screen';
import FriendsScreen from '../Pages/menu-screens/Frineds-screen';
import UserAccountScreen from '../Pages/Screens/user-screens/user-account-screen';
import SettingMenu from '../Components/elements/setting-menu';
import HeaderRightIcons from '../Components/elements/header-right-icons';
import SignUpScreen from '../Pages/Screens/auth screens/sign-up';
import ForgetPasswordScreen from '../Pages/Screens/auth screens/forget-password';
import ChangePasswordScreen from '../Pages/Screens/auth screens/change-password';
import EditProfileScreen from '../Pages/Screens/user-screens/edit-profile';
import SignInScreen from '../Pages/Screens/auth screens/sign-in';
import { FIREBASE_AUTH } from '../firebase/config';
import FriendRequestModal from '../Components/elements/friends-requist-mode';
import ImageScreen from '../Components/elements/image';
import SharePost from '../Components/posts/manage posts/share-post';
import PostScreen from '../Components/posts/post-screen';
const Stack = createStackNavigator();

export default function MainTabNavigator() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    const handleMenuToggle = () => {
        setMenuVisible(!menuVisible);
        setExpanded(!expanded);
    };

    const handleOutsidePress = () => {
        if (menuVisible) {
            setMenuVisible(false);
            setExpanded(false);
        }
    };

    useEffect(() => {

        const unsubscribeAuth = FIREBASE_AUTH.onAuthStateChanged(user => {
            console.log('Auth state changed:', user ? 'Authenticated' : 'Not authenticated');
            setIsAuthenticated(!!user);
            setIsLoading(false);

            if (user) {
                authenticateUser(); 
            }
        });

        return unsubscribeAuth;
    }, []);


    useEffect(() => {
        if (isAuthenticated) {
            const unsubscribeSnapshot = onSnapshot(doc(db, 'users', FIREBASE_AUTH.currentUser.uid), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const newCount = data.friendRequestsReceived ? data.friendRequestsReceived.length : 0;
                    setNotificationCount(newCount);
                }
            });

            return unsubscribeSnapshot;
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
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
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
                                        setModalVisible={setModalVisible}
                                    />
                                ),
                            }}
                        />
                        <Stack.Screen name="PostScreen" component={PostScreen} options={{
                            title: 'Post'
                            ,
                            headerTitleStyle: {
                                color: 'white',
                                right: 20
                            },
                            headerTintColor: "white"

                        }
                        } />
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
                        <Stack.Screen name='share' component={SharePost} options={{ headerShown: false }} />
                        <Stack.Screen name='Friends' component={FriendsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ImageScreen" component={ImageScreen}
                            options={{
                                headerTitle: '',
                                headerStyle: {
                                    backgroundColor: 'black',
                                    elevation: 0,
                                    shadowOpacity: 0,
                                    shadowOffset: { height: 0 },
                                },
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                },
                                headerTintColor: "#fff"
                            }} />
                        <Stack.Screen name='account' component={UserAccountScreen} options={{
                            headerShown: false
                        }} />
                        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
});
