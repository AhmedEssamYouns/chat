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
import ImageViewer from 'react-native-image-zoom-viewer';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const PostItem = ({ item, currentUserId, handleLovePress }) => {
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
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const cancelDelete = () => {
        setModalVisible(false);
    };
    useEffect(() => {
        // Subscribe to real-time updates
        const unsubscribe = getUserById(item.id, (userData) => {
            setUserDetails(userData);
        });

        // Cleanup function to stop listening for updates
        return () => unsubscribe();
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
    const imageUrls = item.imageUrls?.map(url => ({ url }));

    return (
        <>
        <View style={styles.storyItem}>
            <View style={styles.header}>
                <Pressable
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => !isOwner && navigation.navigate('account', { friendId: userDetails.uid })}
                >
                    <Pressable
                        style={styles.avatarContainer}
                        onPress={() => navigation.navigate('ImageScreen', { imageUri: userDetails.profileImage })}
                    >
                        <Image
                            source={{ uri: userDetails.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                            style={styles.avatar}
                        />
                    </Pressable>
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
                    {item.imageUrls && (
                        <TouchableWithoutFeedback>
                            {item.imageUrls && <>
                                {item.imageUrls.length > 1 ?
                                    <ImageViewer
                                        imageUrls={imageUrls}
                                        doubleClickInterval={false}
                                        enableImageZoom={false}
                                        saveToLocalByLongPress={false}
                                        renderIndicator={(currentIndex, allSize) => (
                                            <View style={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 10, padding: 5, borderRadius: 10 }}>
                                                <Text style={{ color: 'white' }}>{`${currentIndex} / ${allSize}`}</Text>
                                            </View>
                                        )}
                                        style={styles.storyPhoto}
                                    />
                                    :
                                    <Image source={{ uri: imageUrls[0].url }} style={styles.storyPhoto}></Image>
                                }
                            </>
                            }
                        </TouchableWithoutFeedback>

                    )}
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
                item={item}
                existingImage={item.imageUrls}
            />
        </View>
        <View style={{
            width:'90%',
            alignSelf:'center',
            borderColor: '#333',
            borderBottomWidth: 1,
        }}></View>
        </>
    );
};

const styles = StyleSheet.create({
    storyItem: {
        marginLeft: 30,
        paddingBottom: 15,
        marginHorizontal: 10,
        marginTop: 15,
        borderRadius: 10,

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
        paddingLeft: 10,
        paddingRight: 55,
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
        marginTop: 10,
        width: '110%',
        height: 300,
        borderRadius: 10,
        borderWidth: 1,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        right: 20,
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
