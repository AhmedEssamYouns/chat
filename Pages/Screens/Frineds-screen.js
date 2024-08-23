import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, db } from '../../firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const FriendsScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const userId = FIREBASE_AUTH.currentUser.uid;
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const friendsIds = userData.friends || [];

                    if (friendsIds.length > 0) {
                        const friendsQuery = query(
                            collection(db, 'users'),
                            where('uid', 'in', friendsIds)
                        );

                        const querySnapshot = await getDocs(friendsQuery);
                        const friendsData = querySnapshot.docs.map(doc => doc.data());
                        setFriends(friendsData);
                    }
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, []);

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedFriend(null);
        setModalVisible(false);
    };

    const renderFriendItem = ({ item }) => (
        <TouchableOpacity style={styles.friendItem} onPress={() => handleFriendClick(item)}>
            <Image source={{ uri: item.profileImage || 'https://th.bing.com/th/id/R.4491e84d823cc08ecfb45c4dcd65dbc0?rik=xKmsWMy9Rwkbxg&pid=ImgRaw&r=0' }} style={styles.friendImage} />
            <Text style={styles.friendName}>{item.username || 'Unknown'}</Text>
        </TouchableOpacity>
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
                        placeholder="Search friends..."
                        placeholderTextColor={'#BBBBBB'}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>

            <FlatList
                data={friends.filter(friend => friend.username.toLowerCase().includes(searchText.toLowerCase()))}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.uid}
                style={styles.friendList}
                contentContainerStyle={styles.friendListContainer}
            />
            {selectedFriend && (
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1} // Prevents the background from registering taps when clicking inside the modal content
                        onPress={closeModal} // Close the modal when clicking outside
                    >
                        <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                            <Image source={{ uri: selectedFriend.profileImage || 'https://th.bing.com/th/id/R.4491e84d823cc08ecfb45c4dcd65dbc0?rik=xKmsWMy9Rwkbxg&pid=ImgRaw&r=0' }} style={styles.modalImage} />
                            <Text style={styles.modalTitle}>{selectedFriend.username || 'Unknown'}</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    closeModal();
                                    navigation.navigate('chat', { friendId: selectedFriend.uid });
                                }}
                            >
                                <Text style={styles.modalButtonText}>Send Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    closeModal();
                                    navigation.navigate('chat', { friendId: selectedFriend.uid });
                                }}
                            >
                                <Text style={styles.modalButtonText}>View Account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => { /* Implement Remove Friend action */ }}>
                                <Text style={styles.modalButtonText}>Remove Friend</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
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
    },
    friendList: {
        marginTop: 10,
    },
    friendListContainer: {
        paddingHorizontal: 20,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#222',
    },
    friendImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    friendName: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#333',
        paddingTop: 80,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalImage: {
        position: "absolute",
        top: -60,
        width: 130,
        height: 130,
        borderWidth: 10,
        elevation: 0,
        borderColor: '#333',
        borderRadius: 100,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#444',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    closeButton: {
        marginTop: 10,
    },
    closeButtonText: {
        color: '#BBBBBB',
        fontSize: 14,
    },
});

export default FriendsScreen;
