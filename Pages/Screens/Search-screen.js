import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, db } from '../../firebase/config';
import { doc, collection, query, where, getDocs } from 'firebase/firestore';
import { monitorFriendStatuses, handleStatusChange } from '../../firebase/frinend-state';

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);
    const [friendStatuses, setFriendStatuses] = useState({});
    const navigation = useNavigation();
    const currentUserId = FIREBASE_AUTH.currentUser.uid;

    useEffect(() => {
        // Fetch all users except the current user
        const fetchUsers = async () => {
            const q = query(collection(db, 'users'), where('uid', '!=', currentUserId));
            const querySnapshot = await getDocs(q);
            const userList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(userList);
        };

        fetchUsers();

        // Monitor real-time friend status updates
        const unsubscribe = monitorFriendStatuses(currentUserId, setFriendStatuses);

        return () => {
            unsubscribe(); // Clean up listener when the component unmounts
        };
    }, [currentUserId]);

    const renderUserItem = ({ item }) => {
        const friendStatus = friendStatuses[item.uid] || 'Add Friend';

        return (
            <View style={styles.userItem}>
                <TouchableOpacity style={{ flexDirection: 'row', width: '70%', alignItems: 'center' }} onPress={() => navigation.navigate('account', { friendId: item.uid })}>
                    <Image source={{ uri: item.profileImage || 'https://via.placeholder.com/50' }} style={styles.userImage} />
                    <Text style={styles.userName}>{item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.statusButton,
                        friendStatus === 'Friend' && { backgroundColor: '#444', width: 90,alignItems:'center' },
                    ]}
                    onPress={() => handleStatusChange(item.uid, currentUserId, friendStatuses, setFriendStatuses)}
                    disabled={friendStatus === 'Friend'} // Disable button for friends
                >
                    <Text style={styles.statusButtonText}>{friendStatus}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchText.toLowerCase())
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
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.uid}
                style={styles.userList}
                contentContainerStyle={styles.userListContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
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
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#222',
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
        width:90,
        alignItems:'center',
        backgroundColor: '#333',
    },
    statusButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});

export default SearchScreen;
