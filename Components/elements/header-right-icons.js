import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HeaderRightIcons({ menuVisible, expanded, setMenuVisible, setExpanded, setModalVisible, notificationCount }) {
    const navigation = useNavigation();

    return (
        <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('search')} style={styles.headerButton}>
                <Feather name="search" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.headerButton}>
                <Feather name="bell" size={24} color="white" />
                {notificationCount > 0 && (
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{notificationCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => {
                setMenuVisible(!menuVisible);
                setExpanded(!expanded);
            }}>
                <Feather name={'more-vertical'} size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
        marginRight: 10,
        position: 'relative',
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    badgeContainer: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 20,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
