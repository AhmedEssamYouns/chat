import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostsList from '../../Components/posts-list';
const userAccount = {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Traveler, Foodie, and Fitness Lover.',
    friendsCount: 10,
    isFriend: true, // Set initial value to false
    posts: [
        {
            id: '1',
            name: 'Jane Smith',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            storyTitle: 'New Recipe Try',
            photo: 'https://via.placeholder.com/200',
            time: '3 days ago',
            likes: 22,
        },
        {
            id: '2',
            name: 'Jane Smith',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            storyTitle: 'Weekend Hiking',
            photo: 'https://via.placeholder.com/200',
            time: '1 week ago',
            likes: 18,
        },
    ],
};

const UserAccountScreen = () => {
    const [isFriend, setIsFriend] = useState(userAccount.isFriend);
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const navigation = useNavigation();

    const handleAddFriend = () => {
        setFriendRequestSent(true);
    };

    const handleCancelRequest = () => {
        setFriendRequestSent(false);
    };

    const handleRemoveFriend = () => {
        Alert.alert(
            "Remove Friend",
            "Are you sure you want to remove this friend?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    onPress: () => setIsFriend(false), // Update the state to remove the friend
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    const handleSendMessage = () => {
        navigation.navigate('Chat', { userId: userAccount.id, userName: userAccount.name });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={styles.profileHeader}>
                <Image source={{ uri: userAccount.avatar }} style={styles.avatar} />
                <View style={{ padding: 15 }}>
                    <Text style={styles.profileName}>{userAccount.name}</Text>
                    <Text style={styles.profileBio}>{userAccount.bio}</Text>
                    <Text style={styles.friendsCount}>Friends: {userAccount.friendsCount}</Text>
                </View>
            </View>

            <View style={styles.actionButtons}>
                {isFriend ? (
                    <TouchableOpacity style={styles.actionButton} onPress={handleRemoveFriend}>
                        <Text style={styles.actionButtonText}>Friend</Text>
                    </TouchableOpacity>
                ) : (
                    friendRequestSent ? (
                        <TouchableOpacity style={styles.actionButton2} onPress={handleCancelRequest}>
                            <Text style={styles.actionButtonText}>Cancel Request</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.actionButton} onPress={handleAddFriend}>
                            <Text style={styles.actionButtonText}>Add Friend</Text>
                        </TouchableOpacity>
                    )
                )}
                <TouchableOpacity style={styles.actionButton} onPress={handleSendMessage}>
                    <Text style={styles.actionButtonText}>Send Message</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Posts</Text>
            <PostsList
                posts={userAccount.posts}
                currentUserId={userAccount.id}
                handleLovePress={() => {}}
                onEditPost={() => {}}
                onDeletePost={() => {}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    profileBio: {
        fontSize: 13,
        color: '#DDDDDD',
        textAlign: 'justify',
        width: 200,
        marginVertical: 10,
    },
    friendsCount: {
        position: 'absolute',
        fontSize: 14,
        color: '#AAAAAA',
        bottom: 10,
        right: -30,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    actionButton: {
        width: 140,
        alignItems: 'center',
        backgroundColor: '#A8342A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    actionButton2: {
        width: 140,
        alignItems: 'center',
        backgroundColor: '#aaaa',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        padding: 15,
    },
});

export default UserAccountScreen;
