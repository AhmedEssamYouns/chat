import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../firebase/config';
import { getUserById } from '../firebase/getUser';
import EditPostModal from './edit-post-model';
import ConfirmationModal from './alert';
import getTimeDifference from './getTime';
import deletePostById from './delete-post';
import LikeButton from '../firebase/add-remove-like';

const PostItem = ({ item, currentUserId, onEdit, onDelete, handleLovePress }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [timeDifference, setTimeDifference] = useState('');
    const isOwner = item.id === FIREBASE_AUTH.currentUser.uid;
    const navigation = useNavigation();

    const handleDelete = () => {
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        setModalVisible(false);
        try {
            await deletePostById(item.postId);
            // You might want to refresh or update your UI here
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const cancelDelete = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (item.id) {
                const userData = await getUserById(item.id);
                setUserDetails(userData);
            }
        };
        fetchUserDetails();
    }, [item.id]);

    useEffect(() => {
        const updateTimeDifference = () => {
            setTimeDifference(getTimeDifference(item.time));
        };

        updateTimeDifference(); // Initial call
        const intervalId = setInterval(updateTimeDifference, 60000); // Update every 60,000 ms (1 minute)

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [item.time]);

    if (!userDetails) {
        return <Text>Loading...</Text>; // Optionally handle loading state
    }

    const isLiked = item.likes && item.likes[currentUserId]; // Check if the post is liked by the current user

    return (
        <View style={styles.storyItem}>
            <View style={styles.header}>
                <Pressable
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => !isOwner && navigation.navigate('account', { friendId: userDetails.uid })}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: userDetails.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.storyName}>{userDetails.username}</Text>
                        <Text style={styles.storyTime}>{timeDifference}</Text> 
                    </View>
                </Pressable>
                {isOwner && (
                    <View style={styles.actionIcons}>
                        <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.iconButton}>
                            <AntDesign name="edit" size={20} color="#bbbb" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                            <AntDesign name="delete" size={20} color="#bbbb" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.storyContent}>
                <View style={styles.storyTextContainer}>
                    {item.text && <Text style={styles.storyTitle}>{item.text}</Text>}
                    {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.storyPhoto} />}
                </View>
                <View style={styles.actionContainer}>
                    <LikeButton 
                        post={item}
                        isLiked={isLiked}
                        currentUserId={currentUserId}
                        handleLovePress={handleLovePress}
                    />
                    <Text style={styles.likesCount}>{item.likesCount || 0}</Text>
                </View>
            </View>

            <ConfirmationModal
                visible={modalVisible}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Are you sure you want to delete this post?"
                confirm="Delete"
            />

            <EditPostModal
                visible={isEditModalVisible}
                onClose={() => setEditModalVisible(false)}
                postId={item.postId}
                existingText={item.text}
                existingImage={item.imageUrl}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    storyItem: {
        marginLeft: 35,
        paddingBottom: 15,
        marginHorizontal: 10,
        marginTop: 15,
        borderRadius: 10,
        borderColor: '#333',
        borderBottomWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 10,
    },
    avatarContainer: {
        borderRadius: 70,
        borderRightWidth: 0.8,
        borderLeftWidth: 1,
        borderBottomLeftRadius: 0,
        borderTopWidth: 2,
        borderColor: '#bbb',
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    headerTextContainer: {
        marginLeft: 10,
    },
    storyName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    storyTime: {
        color: '#BBBBBB',
        fontSize: 12,
    },
    storyContent: {
        marginTop: 10,
    },
    storyTextContainer: {
        paddingHorizontal: 30,
        borderLeftWidth: 1,
        borderLeftColor: '#bbb',
    },
    storyTitle: {
        paddingTop: 12,
        fontSize: 16,
        color: '#DDDDDD',
        marginBottom: 10,
    },
    storyPhoto: {
        width: '100%',
        resizeMode: 'cover',
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems:'center',
        right:20,
        paddingTop: 10,
    },
    loveSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        right: 10,
    },
    loveIcon: {
        marginRight: 10,
    },
    likesCount: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionIcons: {
        flexDirection: 'row',
        position: 'absolute',
        right: 15,
    },
    iconButton: {
        marginHorizontal: 10,
    },
});

export default PostItem;
