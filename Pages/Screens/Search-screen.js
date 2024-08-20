// SearchBar.js
import React, { useEffect, useRef } from 'react';
import { Animated, TextInput, View, TouchableOpacity, StyleSheet, Easing, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ isSearchActive, toggleSearch }) => {
    const searchBarWidth = useRef(new Animated.Value(0)).current;
    const suggestionOpacity = useRef(new Animated.Value(0)).current;
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isSearchActive && searchInputRef.current) {
            searchInputRef.current.focus();
        }

        // Animate based on search state
        Animated.parallel([
            Animated.timing(searchBarWidth, {
                toValue: isSearchActive ? 1 : 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }),
            Animated.timing(suggestionOpacity, {
                toValue: isSearchActive ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isSearchActive]);

    return (
        <View style={{ width: '100%' }}>
            <Animated.View
                style={[
                    styles.searchBar,
                    {
                        width: searchBarWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '133%'],
                        }),
                    },
                ]}
            >
                <TouchableOpacity onPress={toggleSearch} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <TextInput
                    ref={searchInputRef}
                    placeholder="Search..."
                    placeholderTextColor="gray"
                    style={styles.searchInput}
                    onBlur={toggleSearch}
                    onSubmitEditing={Keyboard.dismiss}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        paddingHorizontal: 10,
        justifyContent: 'center',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 10,
    },
    searchInput: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
});

export default SearchBar;
