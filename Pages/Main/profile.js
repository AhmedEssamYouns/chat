// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PostsList from '../../Components/posts-list';
import { FIREBASE_AUTH, db } from '../../firebase/config';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import PostsModal from '../../Components/PostsModel';
import PostGrid from '../../Components/postsGrid';
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

        const userDocRef = doc(db, 'users', userId);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setUserProfile((prevProfile) => ({
                    ...prevProfile,
                    id: userId,
                    name: userData.username,
                    avatar: userData.profileImage || 'https://th.bing.com/th/id/R.4491e84d823cc08ecfb45c4dcd65dbc0?rik=xKmsWMy9Rwkbxg&pid=ImgRaw&r=0',
                    bio: userData.bio,
                    friends: userData.friends?.length
                }));
            }
        });

        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('id', '==', userId));
        const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserProfile(prevProfile => ({
                ...prevProfile,
                posts,
            }));
        });

        return () => {
            unsubscribeUser();
            unsubscribePosts();
        };
    }, []);

    const handleModalOpen = () => setModalVisible(true);
    const handleModalClose = () => setModalVisible(false);

    const handlePostSelect = (index) => {
        console.log('Selected post index:', index); // Logs the selected post index
        setSelectedPost(index);
        handleModalOpen();
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={styles.profileHeader}>
                <Pressable style={{ zIndex: 1 }} onPress={() => navigation.navigate('ImageScreen', { imageUri: userProfile.avatar })}>
                    <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                </Pressable>
                <View style={{ padding: 15 }}>
                    <Text style={styles.profileName}>{userProfile.name}</Text>
                    <Text style={styles.profileBio}>{userProfile.bio}</Text>
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
        marginVertical: 10,
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
