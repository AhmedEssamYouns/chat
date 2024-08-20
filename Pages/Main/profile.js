import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const userProfile = {
    id: '1',
    name: 'John Doe',
    bio: 'Fitness enthusiast, Gym lover, and aspiring bodybuilder.',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    posts: [
        {
            id: '1',
            title: 'Morning Workout',
            photo: 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/02/walter-white-and-gustavo-fring-from-breaking-bad.jpg',
            time: '2 days ago',
            likes: 32,
        },
        {
            id: '2',
            title: 'Healthy Meal Prep',
            photo: 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/02/walter-white-and-gustavo-fring-from-breaking-bad.jpg',
            time: '1 week ago',
            likes: 15,
        },
        // Add more posts as needed
    ],
};

const ProfileScreen = () => {
    const navigation = useNavigation()
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [updatedBio, setUpdatedBio] = useState(userProfile.bio);

    const handleEditProfile = () => {
        // Handle profile update logic
        console.log('Profile updated:', updatedBio);
        setEditModalVisible(false);
    };

    const renderPostItem = ({ item }) => (
        <View style={styles.postItem}>
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postTime}>{item.time}</Text>
            </View>
            <Image source={{ uri: item.photo }} style={styles.postPhoto} />
            <View style={styles.postActions}>
                <View style={styles.likesContainer}>
                    <AntDesign name="heart" size={20} color="#FF6347" />
                    <Text style={styles.likesText}>{item.likes}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                        <AntDesign name="edit" size={20} color="#aaaa" style={styles.actionIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <AntDesign name="delete" size={20} color="#aaaa" style={styles.actionIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={styles.profileHeader}>
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                <View style={{ padding: 15 }}>
                    <Text style={styles.profileName}>{userProfile.name}</Text>
                    <Text style={styles.profileBio}>{userProfile.bio}</Text>
                </View>
                <Feather name="edit" size={18} color="tomato" style={styles.editButton} />
                <TouchableOpacity style={{ position: "absolute", right: 20, bottom: 12, }} onPress={() => navigation.navigate("Friends")}>
                    <Text style={{ color: '#ccc', fontSize: 18 }}>Friends <Text style={{ fontWeight: 'bold', color: 'white' }}>17</Text><View ></View></Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recent Posts</Text>
            <FlatList
                data={userProfile.posts}
                renderItem={renderPostItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.postsList}
                ListFooterComponent={
                    userProfile.posts.length > 0 ? (
                        <Text style={styles.endOfPostsText}>End of Posts</Text>
                    ) : null
                }
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        padding: 15,
    },
    postsList: {
        paddingHorizontal: 15,
        paddingBottom: 20
    },
    postItem: {
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderColor: '#333'

    },
    postTitle: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 10,
    },
    postPhoto: {
        width: '100%',
        resizeMode: 'contain',
        height: 200,
        borderRadius: 20,
        marginBottom: 10,
    },
    postTime: {
        fontSize: 12,
        color: '#BBBBBB',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
    },
    actionIcon: {
        marginHorizontal: 10,
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likesText: {
        color: '#FFFFFF',
        marginLeft: 5,
        fontSize: 14,
    },
    endOfPostsText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
        color: 'gray',
    },
});

export default ProfileScreen;
