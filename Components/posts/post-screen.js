import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import PostItem from './posts-list/post-item';
import { FIREBASE_AUTH } from '../../firebase/config';
import { fetchPostById } from '../../firebase/fetchPosts';

const PostScreen = ({ route }) => {
    const { post } = route.params; 
    const currentUserId = FIREBASE_AUTH.currentUser.uid;
    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = fetchPostById(post.postId, (data) => {
            setPostData(data);
            setLoading(false); 
        });

        return () => unsubscribe();
    }, [post.postId]);

    if (loading) {
        return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>; 
    }

    return (
        <ScrollView style={styles.container}>
            {postData ? (
                <PostItem item={postData} currentUserId={currentUserId} handleLovePress={() => {  }} />
            ) : (
                <View style={styles.container}><Text style={styles.noPostText}>Post not found</Text></View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingText: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
        top: 20,
    },
    noPostText: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
        top: 20,
    }
});

export default PostScreen;
