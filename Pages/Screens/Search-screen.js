// SearchScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const mockData = [
    { id: '1', name: 'John Doe', image: 'https://via.placeholder.com/50', status: 'Add Friend' },
    { id: '2', name: 'Jane Smith', image: 'https://via.placeholder.com/50', status: 'Friend' },
    { id: '3', name: 'Michael Johnson', image: 'https://via.placeholder.com/50', status: 'Cancel Request' },
    { id: '4', name: 'Emily Davis', image: 'https://via.placeholder.com/50', status: 'Add Friend' },
    { id: '5', name: 'Chris Wilson', image: 'https://via.placeholder.com/50', status: 'Friend' },
];

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState(mockData);
    const navigation = useNavigation();

    const handleSearch = (suggestion) => {
        console.log(`Searching for ${suggestion}`);
    };

    const handleStatusChange = (id) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) => {
                if (user.id === id) {
                    // Toggle the button state
                    if (user.status === 'Add Friend') return { ...user, status: 'Cancel Request' };
                    if (user.status === 'Cancel Request') return { ...user, status: 'Add Friend' };
                }
                return user;
            })
        );
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <Image source={{ uri: item.image }} style={styles.userImage} />
            <Text style={styles.userName}>{item.name}</Text>
            <TouchableOpacity
                style={[
                    styles.statusButton,
                    item.status === 'Friend' && { backgroundColor: '#444' },
                ]}
                onPress={() => handleStatusChange(item.id)}
                disabled={item.status === 'Friend'} // Disable button for friends
            >
                <Text style={styles.statusButtonText}>{item.status}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor={'#BBBBBB'}
                        value={searchText}
                        onChangeText={setSearchText}
                        autoFocus
                    />
                </View>
             
            </View>

            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                style={styles.userList}
                contentContainerStyle={styles.userListContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: '#121212',
    },
    searchSection: {
        paddingHorizontal: 20,
        borderBottomColor: '#444',
        borderBottomWidth: 1,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    searchInput: {
        backgroundColor: '#222',
        height: 40,
        borderRadius: 50,
        paddingHorizontal: 20,
        color: '#FFFFFF',
        flex: 1,
        elevation: 2,
    },
    suggestionsContainer: {
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    suggestionButton: {
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    suggestionText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    userList: {
        marginTop: 10,
    },
    userListContainer: {
        paddingHorizontal: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom:10,
        borderBottomWidth:0.5,
        borderBottomColor:'#222'
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    userName: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
    },
    statusButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        backgroundColor: '#333',
    },
    statusButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});

export default SearchScreen;
