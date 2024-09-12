import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, ToastAndroid } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import useFriends from '../../firebase/frinend-state';
import { sendMessage } from '../../firebase/manage-Chat-room';

const SharePost = () => {
    const route = useRoute();
    const { post, user } = route.params;
    console.log(post)
    console.log(user)
    const [searchText, setSearchText] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [isSharingPost, setIsSharingPost] = useState(false);
    const { friends, loading } = useFriends();
    const navigation = useNavigation();

    const handleFriendClick = (friend) => {
        if (selectedFriends.includes(friend)) {
            setSelectedFriends(selectedFriends.filter(f => f !== friend));
        } else if (selectedFriends.length < 5) {
            setSelectedFriends([...selectedFriends, friend]);
        }
    };

    const handleSharePost = async () => {
        if (selectedFriends.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'No Friends Selected',
                text2: 'Please select at least one friend to share the post with.',
            });
            return;
        }

        setIsSharingPost(true);
        try {
            for (const friend of selectedFriends) {
                await sendMessage(friend.uid, '', null, post, user); // Send the postId to each selected friend
                console.log(friend.uid)
            }
            setSelectedFriends([]);
            console.log('post shared')
            ToastAndroid.show('snap shared.', ToastAndroid.LONG);

            Toast.show({
                type: 'success',
                text1: 'Post Shared',
                text2: 'Your post has been shared successfully.',
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error sharing post:', error);
            Toast.show({
                type: 'error',
                text1: 'Share Failed',
                text2: 'There was an error sharing the post. Please try again.',
            });
        } finally {
            setIsSharingPost(false);
        }
    };

    const renderFriendItem = ({ item }) => {
        const isSelected = selectedFriends.includes(item);
        return (
            <TouchableOpacity
                style={[styles.friendItem, isSelected && styles.selectedFriendItem]}
                onPress={() => handleFriendClick(item)}
            >
                <Image source={{ uri: item.profileImage || 'https://via.placeholder.com/50' }} style={styles.friendImage} />
                <Text style={styles.friendName}>{item.username || 'Unknown'}</Text>
                {isSelected && <Feather name="check-circle" size={24} color="#00FF00" />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
            ) : (
                <>
                    <View style={styles.searchSection}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Feather name="arrow-left" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search friends by name..."
                                placeholderTextColor={'#BBBBBB'}
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    </View>

                    <FlatList
                        data={friends.filter(friend => friend.username.toLowerCase().includes(searchText.toLowerCase()))}
                        renderItem={renderFriendItem}
                        keyExtractor={(item) => item.uid}
                        style={styles.friendList}
                        contentContainerStyle={styles.friendListContainer}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No users found</Text>
                            </View>
                        }
                    />

                    {selectedFriends.length > 0 && (
                        <View style={styles.bottomSection}>
                            <TouchableOpacity
                                style={styles.sharePostButton}
                                onPress={handleSharePost}
                                disabled={isSharingPost}
                            >
                                {isSharingPost ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.sharePostButtonText}>Share Post ({selectedFriends.length}/5)</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    searchSection: {
        paddingHorizontal: 20,
        borderBottomColor: '#444',
        borderBottomWidth: 1,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    searchInput: {
        backgroundColor: '#222',
        height: 40,
        borderRadius: 50,
        paddingHorizontal: 20,
        color: '#FFFFFF',
        flex: 1,
    },
    friendList: {
        marginTop: 10,
    },
    friendListContainer: {
        paddingHorizontal: 20,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#222',
    },
    selectedFriendItem: {
        borderRadius: 50,
        backgroundColor: '#333',
        borderColor: '#00FF00',
        borderWidth: 1,
    },
    friendImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    friendName: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
    },
    bottomSection: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
    sharePostButton: {
        backgroundColor: '#A8342A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    sharePostButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: '#BBBBBB',
        fontSize: 16,
    },
});

export default SharePost;
