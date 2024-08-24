import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PostsList from '../../Components/posts-list';
import { FIREBASE_AUTH, db } from '../../firebase/config';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
const ProfileScreen = () => {
    const navigation = useNavigation();
    const [userProfile, setUserProfile] = useState({
        id: FIREBASE_AUTH.currentUser.uid,
        name: FIREBASE_AUTH.currentUser.displayName,
        bio: 'edit profile to add bio',
        posts: [],
        friends:0,
    });


    useEffect(() => {
        const userId = FIREBASE_AUTH.currentUser.uid;

        // Fetch user profile data
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

        // Fetch user posts
        const postsRef = collection(db, 'posts');
        const postsQuery = query(postsRef, where('id', '==', userId));
        const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserProfile(prevProfile => ({
                ...prevProfile,
                posts,
            }));
        });

        // Clean up listeners on component unmount
        return () => {
            unsubscribeUser();
            unsubscribePosts();
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={styles.profileHeader}>
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
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
                <Text style={styles.sectionTitle}>Recent Posts</Text>

                <TouchableOpacity style={styles.friendsButton} onPress={() => navigation.navigate('Friends')}>
                    <Text style={{ color: '#ccc', fontSize: 15 }}>
                        Friends <Text style={{ fontWeight: 'bold', color: 'white' }}>{userProfile.friends}</Text>
                    </Text>
                </TouchableOpacity>
            </View>

            <PostsList
                posts={userProfile.posts}
                currentUserId={userProfile.id}
                handleLovePress={(postId) => console.log('Love pressed for post:', postId)}
                onEditPost={(postId) => console.log('Edit post:', postId)}
                onDeletePost={(postId) => console.log('Delete post:', postId)}
            />
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
        position: 'absolute',
        right: 20,
        bottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        color: '#BBBBBB',
        position: 'absolute',
        left: 30,
        bottom: 10,
    },
});

export default ProfileScreen;
