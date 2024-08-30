import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PostsList from './posts-list';

const PostsModal = ({ posts, onClose ,initialPost,id}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Snaps</Text>
                <View style={{ width: 24 }} /> 
            </View>
            <PostsList
                posts={posts}
                initialPostindex={initialPost}
                currentUserId={id} 
                handleLovePress={(postId) => console.log('Love pressed for post:', postId)}
                onEditPost={(postId) => console.log('Edit post:', postId)}
                onDeletePost={(postId) => console.log('Delete post:', postId)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft:10,
    },
});

export default PostsModal;
