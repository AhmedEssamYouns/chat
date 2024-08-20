import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Keyboard, View, Text, StyleSheet } from 'react-native';
import TabNavigator from './tabs-nav';
import ChatConversationScreen from '../Pages/Screens/chat-room'
import SearchScreen from '../Pages/Screens/Search-screen';
import { useNavigation } from '@react-navigation/native';
import FriendsScreen from '../Pages/Screens/Frineds-screen';

const Stack = createStackNavigator();


export default function MainTabNavigator() {
    const navigation = useNavigation()
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#121212' },
                contentStyle: { backgroundColor: '#121212' }, // This affects the background color of the screen content
                cardStyle: { backgroundColor: '#121212' }, // This affects the background color of the cards
            }}>
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
                            <TouchableOpacity onPress={() => console.log('More options pressed')}>
                                <Feather name="more-vertical" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            <Stack.Screen
                name='chat'
                component={ChatConversationScreen}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name='search'
                component={SearchScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='Friends'
                component={FriendsScreen}
                options={{
                    headerShown: false
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
