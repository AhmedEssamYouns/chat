import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Keyboard, View, Text, StyleSheet } from 'react-native';
import ChatScreen from '../MainPages/home';
import StoriesScreen from '../MainPages/stories';
import ProfileScreen from '../MainPages/profile';
import FloatingButton from '../Components/FloatingButton';
import ChatConversationScreen from '../Screens/ChatScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TabNavigator({ navigation }) {

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

export default function MainTabNavigator() {
    return (
        <Stack.Navigator>

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

            <Stack.Screen
                name='chat'
                component={ChatConversationScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#121212',
                        elevation:1
                    },
                    headerTitleStyle: {
                        right:20,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 18,
                    },
                    headerTintColor: 'white'
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
