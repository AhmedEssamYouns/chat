import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { AntDesign, Feather,FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../firebase/config';
import { getUserById } from '../../../firebase/getUser';
import EditPostModal from '../manage posts/edit-post-model';
import ConfirmationModal from '../../elements/alert';
import getTimeDifference from '../manage posts/getTime';
import deletePostById from '../../../firebase/manage-posts';
import LikeButton from '../../Buttons/add-remove-like';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';

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
        const unsubscribe = getUserById(item.id, (userData) => {
            setUserDetails(userData);
        });

        return () => unsubscribe();
    }, [item.id]);

    useEffect(() => {
        const updateTimeDifference = () => {
            setTimeDifference(getTimeDifference(item.time));
        };

        updateTimeDifference(); 
        const intervalId = setInterval(updateTimeDifference, 60000); 

        return () => clearInterval(intervalId)
    }, [item.time]);

    if (!userDetails) {
        return <Text>Loading...</Text>;
    }
    const postId = item.postId
    const isLiked = item.likes && item.likes[currentUserId]; 
    const imageUrls = item.imageUrls?.map(url => ({ url }));

    return (
        <>
            <View style={styles.storyItem}>
                <View style={styles.header}>
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => isOwner ?
                            navigation.navigate('Tabs', {
                                screen: 'profile', // 
                            }) : navigation.navigate('account', {friendId: userDetails.uid })}
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
                    <View style={styles.loveSection}>
                        <LikeButton
                            post={item}
                            isLiked={isLiked}
                            currentUserId={currentUserId}
                            handleLovePress={handleLovePress}
                        />
                        <Text style={styles.likesCount}>{item.likesCount || null}</Text>
                    </View>
                    <TouchableOpacity style={{ paddingRight: 5 }} onPress={() => navigation.navigate('share', { post: item, user: userDetails })}>
                        <Feather name='send' color={'grey'} size={24} />
                    </TouchableOpacity>
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
        </View >

        </>
    );
};

const styles = StyleSheet.create({
    storyItem: {
        borderRadius: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 10,

    },
    avatarContainer: {
        alignSelf: 'center',
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    headerTextContainer: {
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
        borderRadius: 20,
    },
    storyTitle: {
        fontSize: 16,
        color: '#DDDDDD',
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    storyPhoto: {
        marginTop: 10,
        width: 340,
        alignSelf:"center",
        height: 400,
        borderRadius: 10,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    loveSection: {
        flexDirection: 'row',
        marginTop: 10,
    },
    loveIcon: {
        marginRight: 0,
    },
    likesCount: {
        color: 'white',
        fontSize: 16,
        top: 3,
        fontWeight: 'bold',
    },
    actionIcons: {
        flexDirection: 'row',
        position: 'absolute',
        right: 0,
    },
    iconButton: {
        marginHorizontal: 10,
    },
});

export default PostItem;
