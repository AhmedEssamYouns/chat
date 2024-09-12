import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated, BackHandler, Text } from 'react-native';
import { Feather, Octicons, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RotatingButton from './animated-rotate-button';
import CreatePostModal from '../posts/manage posts/create-post-model';

// Regular FloatingButton component
export function FloatingButton({ onPress, icon, up }) {
    return (
        <View style={[styles.container, { bottom: up }]}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Feather name={icon} size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

export function AnimatedFloatingButton({ up, expanded, setExpanded }) {
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const [rotate] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(animation, {
                toValue: expanded ? 1 : 0,
                duration: 300,
                useNativeDriver: false, // Height animations
            }),
            Animated.timing(rotate, {
                toValue: expanded ? 1 : 0,
                duration: 300,
                useNativeDriver: true, // Rotation animations
            }),
        ]).start();
    }, [expanded]);

    useEffect(() => {
        const handleBackPress = () => {
            if (expanded) {
                setExpanded(false); // Close the bar if it's open
                return true; // Prevent the default back action
            }
            return false; // Allow the default back action
        };

        // Add back button event listener
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Cleanup the event listener
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [expanded]);

    const animatedHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200], // Adjust as needed
    });

    const rotation = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'], // Rotate by 180 degrees
    });

    const toggleBar = () => {
        setExpanded(prev => !prev);
    };

    return (
        <View style={[styles.container, { bottom: up }]}>
            <RotatingButton
                size={60}
                backgroundColor={'#f44336'}
                onPress={toggleBar}
                icon={expanded ? 'arrow-up' : 'plus'}
                expanded={expanded}
            />
            <Animated.View style={[styles.bar, { height: animatedHeight }]}>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        setExpanded(false);
                        setIsModalVisible(true);
                    }}
                >
                    <Feather name="share" size={24} color="white" />
                    <Text style={styles.label}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        setExpanded(false);
                        navigation.navigate('Friends');
                    }}
                >
                    <Octicons name="people" size={24} color="white" />
                    <Text style={styles.label}>friends</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        setExpanded(false);
                        navigation.navigate('search');
                    }}
                >
                    <AntDesign name="adduser" size={24} color="white" />
                    <Text style={styles.label}>add</Text>
                </TouchableOpacity>
            </Animated.View>

            <CreatePostModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </View>
    );
}

// Styles for both components
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
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bar: {
        position: 'absolute',
        width: 60,
        bottom: 30,
        backgroundColor: '#333',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        paddingVertical: 10,
    },
    item: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 7,
        width: '100%', // Ensure full width for each item
    },
    label: {
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
        fontSize: 8, // Adjust label size
    },
});
