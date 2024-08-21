import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

const RotatingButton = ({ onPress, icon, expanded,size,backgroundColor }) => {
    const [rotate] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(rotate, {
            toValue: expanded ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [expanded]);

    const rotation = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <Pressable onPress={onPress} style={[styles.button,{backgroundColor:backgroundColor,width:size,height:size}]}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Feather name={icon} size={24} color="white" />
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
    },
});

export default RotatingButton;
