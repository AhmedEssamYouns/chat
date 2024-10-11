import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, doc, query, where, onSnapshot } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '../../../firebase/config';
import { handleStatusChange, removeFriend, monitorFriendStatuses } from '../../../firebase/frinend-state';
import PostGrid from '../../../Components/posts/posts-Thumbnail/postsGrid';
import PostsModal from '../../../Components/posts/posts-list/PostsModel';
import ConfirmationModal from '../../../Components/elements/alert';
import { Feather } from '@expo/vector-icons';

const UserAccountScreen = () => {
    const route = useRoute();
    const { friendId } = route.params;
    const [user, setUser] = useState({ posts: [] });
    const [friendStatuses, setFriendStatuses] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [modalAction, setModalAction] = useState(null);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const navigation = useNavigation();
    const currentUserId = FIREBASE_AUTH.currentUser.uid;

    useEffect(() => {
        const userRef = doc(db, 'users', friendId);
        const unsubscribeUser = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                setUser(prevUser => ({ ...userData, posts: prevUser.posts || [] }));
            } else {
                console.error('User document not found');
            }
        }, (error) => {
            console.error('Error fetching user details:', error);
        });


        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('id', '==', friendId));
        const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUser(prevProfile => ({
                ...prevProfile,
                posts,
            }));
        });


        return () => {
            unsubscribeUser();
            unsubscribePosts();
        };
    }, [friendId]);

    useEffect(() => {
        const unsubscribe = monitorFriendStatuses(currentUserId, setFriendStatuses);
        return () => unsubscribe(); 
    }, [currentUserId]);

    const currentStatus = friendStatuses[friendId] || 'Add Friend';

    const handleStatusAction = () => {
        if (currentStatus === 'Friend') {
            setModalAction(() => () => removeFriend(friendId, currentUserId, friendStatuses, setFriendStatuses));
            setIsModalVisible(true);
        } else {
            handleStatusChange(friendId, currentUserId, friendStatuses, setFriendStatuses);
        }
    };

    const handleSendMessage = () => {
        navigation.navigate('chat', { friendId });
    };

    const handleConfirmDelete = () => {
        if (modalAction) modalAction();
        setIsModalVisible(false);
    };

    const handleCancelDelete = () => {
        setIsModalVisible(false);
    };

    const [selectedPost, setSelectedPost] = useState(0);
    const handleModalOpen = () => setModalVisible2(true);
    const handlePostSelect = (index) => {
        setSelectedPost(index);
        handleModalOpen();
    };

    if (!user) return <Text>Loading...</Text>;

    const handleModalClose = () => {
        setModalVisible2(false);
    };

    const cleanBio = (bio) => {
        if (!bio) {
            return ''; 
        }
        return bio
            .split('\n')
            .filter(line => line.trim() !== '')
            .join('\n');
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#121212', }}>
            <View style={{ flexDirection: "row", alignItems: 'center', gap: 20, paddingBottom: 10, borderBottomColor: '#333', borderBottomWidth: 1 }}>
                <Feather name='arrow-left' size={25} color={'#fff'} style={{ left: 15, padding: 10 }} onPress={() => navigation.goBack()} />
                <Text style={styles.profileName}>{user.username}</Text>
            </View>
            <View style={styles.profileHeader}>
                <Pressable style={{ zIndex: 1 }} onPress={() => navigation.navigate('ImageScreen', { imageUri: user.profileImage })}>
                    <Image source={{ uri: user.profileImage }} style={styles.avatar} />
                </Pressable>
                <View style={{ padding: 15 }}>
                    <Text style={{ color: 'white', fontSize: 15 }}>@{user.username}</Text>

                    <Text style={styles.profileBio}>{cleanBio(user.bio) || 'no bio'}</Text>
                </View>

            </View>

            <View style={{ borderBottomColor: '#222', borderBottomWidth: 1 }}>
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleStatusAction}>
                        <Text style={styles.actionButtonText}>
                            {currentStatus === 'Friend' ? 'Unfriend' : currentStatus === 'Cancel Request' ? 'Cancel Request' : 'Add Friend'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleSendMessage}>
                        <Text style={styles.actionButtonText}>Send Message</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.sectionTitle}>Snaps</Text>
                    <Text style={styles.friendsCount}>Friends: {user.friends?.length || 0}</Text>
                </View>
            </View>
                <PostGrid
                    userId={friendId}
                    onPostSelect={handlePostSelect}
                />
            <Modal
                visible={isModalVisible2}
                animationType="slide"
                transparent={false}
                onRequestClose={handleModalClose}
            >
                <PostsModal
                    posts={user.posts}
                    id={friendId}
                    initialPost={selectedPost}
                    onClose={handleModalClose}
                />
            </Modal>

            <ConfirmationModal
                visible={isModalVisible}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                message="Are you sure you want to unfriend this user?"
                confirm="Unfriend"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        paddingTop: 15,
        flexDirection: 'row',
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
        marginTop: 10,
    },
    friendsCount: {
        fontSize: 14,
        paddingHorizontal: 25,
        color: '#AAAAAA',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 20,
    },
    actionButton: {
        width: 140,
        alignItems: 'center',
        backgroundColor: '#222',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        paddingHorizontal: 25,
        paddingBottom: 10,
    },
});

export default UserAccountScreen;
