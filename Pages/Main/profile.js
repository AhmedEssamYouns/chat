import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PostsList from '../../Components/posts-list';
const userProfile = {
    id: '1',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Fitness enthusiast, Gym lover, and aspiring bodybuilder.',
    posts: [
        {
            id: '1',
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            storyTitle: 'New Recipe Try',
            photo: 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/02/walter-white-and-gustavo-fring-from-breaking-bad.jpg',
            time: '2 days ago',
            likes: 32,
        },
        {
            id: '2',
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            storyTitle: 'New Recipe Try',
            photo: 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/02/walter-white-and-gustavo-fring-from-breaking-bad.jpg',
            time: '1 week ago',
            likes: 15,
        },
        // Add more posts as needed
    ],
};

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [updatedBio, setUpdatedBio] = useState(userProfile.bio);

    const handleEditProfile = () => {
        // Handle profile update logic
        console.log('Profile updated:', updatedBio);
        setEditModalVisible(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={styles.profileHeader}>
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                <View style={{ padding: 15 }}>
                    <Text style={styles.profileName}>{userProfile.name}</Text>
                    <Text style={styles.profileBio}>{userProfile.bio}</Text>
                </View>
                <Feather name="edit" size={18} color="tomato" style={styles.editButton} onPress={()=>navigation.navigate('edit profile')} />
                <TouchableOpacity style={styles.friendsButton} onPress={() => navigation.navigate("Friends")}>
                    <Text style={{ color: '#ccc', fontSize: 15 }}>Friends <Text style={{ fontWeight: 'bold', color: 'white' }}>17</Text></Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recent Posts</Text>
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
        flexDirection: "row",
        alignItems: 'center',
        padding: 20,
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
        top: 40,
    },
    friendsButton: {
        position: "absolute",
        right: 20,
        bottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        padding: 15,
    },
});

export default ProfileScreen;
