// FloatingButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

const FloatingButton = ({ onPress }) => (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
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
