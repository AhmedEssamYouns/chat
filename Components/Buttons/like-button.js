// AnimatedHeartIcon.js
import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const AnimatedHeartIcon = ({ isLiked }) => {
    const [scaleValue] = useState(new Animated.Value(1));

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleValue, {
                toValue: isLiked ? 1.2 : 1,
                friction: 2,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 2,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isLiked]);

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <AntDesign
                name={isLiked ? 'heart' : 'hearto'}
                size={24}
                color={isLiked ? 'tomato' : 'gray'}
            />
        </Animated.View>
    );
};

export default AnimatedHeartIcon;
