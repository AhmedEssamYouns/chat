// FloatingButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const FloatingButton = ({ onPress, icon, up }) => (
    <View style={[styles.container, { bottom: up }]}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Feather name={icon} size={24} color="white" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        zIndex: 100,
    },
    button: {
        backgroundColor: '#f44336',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FloatingButton;
