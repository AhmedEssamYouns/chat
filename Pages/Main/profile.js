// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PostsModal from '../../Components/posts/posts-list/PostsModel';
import PostGrid from '../../Components/posts/posts-Thumbnail/postsGrid';
import { FIREBASE_AUTH } from '../../firebase/config';
import { fetchUserData,fetchUserPosts } from '../../firebase/getUser';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [userProfile, setUserProfile] = useState({
        id: FIREBASE_AUTH.currentUser.uid,
        name: FIREBASE_AUTH.currentUser.displayName,
        bio: 'edit profile to add bio',
        posts: [],
        friends: 0,
    });
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(0);

    useEffect(() => {
        const userId = FIREBASE_AUTH.currentUser.uid;

        const unsubscribeUser = fetchUserData(userId, setUserProfile);
        const unsubscribePosts = fetchUserPosts(userId, setUserProfile);

        return () => {
            unsubscribeUser();
            unsubscribePosts();
        };
    }, []);

    const handleModalOpen = () => setModalVisible(true);
    const handleModalClose = () => setModalVisible(false);

    const handlePostSelect = (index) => {
        console.log('Selected post index:', index); 
        setSelectedPost(index);
        handleModalOpen();
    };

    const cleanBio = (bio) => {
        if (!bio) {
            return ''; // Return an empty string if bio is null or undefined
        }
        return bio
            .split('\n')
            .filter(line => line.trim() !== '')
            .join('\n');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={styles.profileHeader}>
                <Pressable style={{ zIndex: 1 }} onPress={() => navigation.navigate('ImageScreen', { imageUri: userProfile.avatar })}>
                    <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                </Pressable>
                <View style={{ padding: 15 }}>
                    <Text style={styles.profileName}>{userProfile.name}</Text>
                    <Text style={styles.profileBio}>{cleanBio(userProfile.bio) || 'no bio'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('edit profile')}
                >
                    <Feather name="edit" size={18} color="tomato" />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', position: 'absolute', justifyContent: 'space-between', bottom: 0, width: '110%' }}>
                    <TouchableOpacity
                        style={styles.postsButton}
                        onPress={handleModalOpen}
                    >
                        <Text style={styles.sectionTitle}>Snaps</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.friendsButton}
                        onPress={() => navigation.navigate('Friends')}
                    >
                        <Text style={{ color: '#ccc', fontSize: 15 }}>
                            Friends <Text style={{ fontWeight: 'bold', color: 'white' }}>{userProfile.friends}</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <PostGrid
                userId={userProfile.id}
                onPostSelect={handlePostSelect}
            />

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={handleModalClose}
            >
                <PostsModal
                    posts={userProfile.posts}
                    id={userProfile.id}
                    initialPost={selectedPost} 
                    onClose={handleModalClose}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
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
    },
    editButton: {
        position: 'absolute',
        right: 20,
        padding: 10,
        top: 40,
    },
    friendsButton: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 15,
        color: '#BBBBBB',
    },
    postsButton: {
        padding: 10,
    },
});

export default ProfileScreen;
