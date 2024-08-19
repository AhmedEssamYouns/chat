import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Keyboard, View, Text, StyleSheet } from 'react-native';
import TabNavigator from './tabs-nav';
import ChatConversationScreen from '../Pages/Screens/ChatScreen';

const Stack = createStackNavigator();


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
                  headerShown:false
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
