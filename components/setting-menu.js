// components/SettingMenu.js
import React,{useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity ,BackHandler} from 'react-native';
import { Feather } from '@expo/vector-icons';
const SettingMenu = ({ visible, onClose }) => {
    useEffect(() => {
        const handleBackPress = () => {
            if (visible) {
                onClose();
                return true; // Prevent the default behavior of going back
            }
            return false; // Allow default behavior if menu is not visible
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => backHandler.remove();
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Edit Profile')}>
                <Feather name="edit" size={24} color="white" />
                <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Change Password')}>
                <Feather name="key" size={24} color="white" />
                <Text style={styles.menuText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Forgot Password')}>
                <Feather name="help-circle" size={24} color="white" />
                <Text style={styles.menuText}>Forgot Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutItem} onPress={() => console.log('Logout')}>
                <Feather name="log-out" size={24} color="white" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: '#1F1F1F',
        borderRadius: 8,
        padding: 10,
        width: 200,
        zIndex: 1000,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    menuText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    logoutText: {
        color: 'tomato',
        marginLeft: 10,
        fontSize: 16,
    },
});

export default SettingMenu;
