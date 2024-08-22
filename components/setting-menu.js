import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingMenu = ({ visible, onClose }) => {
    const navigation = useNavigation();

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

    // Return null if the menu is not visible
    if (!visible) return null;

    return (
        <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => {onClose(),navigation.navigate('edit profile')}}>
                <Feather name="edit" size={24} color="white" />
                <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() =>{onClose(), navigation.navigate('ChangePassword')}}>
                <Feather name="key" size={24} color="white" />
                <Text style={styles.menuText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() =>{onClose(), navigation.navigate('ForgetPassword')}}>
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
        top: 90,
        right: 30,
        backgroundColor: '#1F1F1F',
        borderRadius: 8,
        padding: 10,
        width: 200,
        zIndex: 3000,
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
