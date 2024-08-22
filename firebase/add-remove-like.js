// LikeButton.js
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './config';
import AnimatedHeartIcon from '../Components/like-button';

const LikeButton = ({ post, isLiked, currentUserId }) => {
    const [liked, setLiked] = useState(isLiked);

    useEffect(() => {
        setLiked(isLiked);
    }, [isLiked]);

    const handleLikePress = async () => {
        const postRef = doc(db, 'posts', post.postId);

        try {
            if (liked) {
                // Remove like
                await updateDoc(postRef, {
                    likesCount: increment(-1),
                    [`likes.${currentUserId}`]: false,
                });
                setLiked(false);
            } else {
                // Add like
                await updateDoc(postRef, {
                    likesCount: increment(1),
                    [`likes.${currentUserId}`]: true,
                });
                setLiked(true);
            }
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    return (
        <TouchableOpacity onPress={handleLikePress} style={styles.button}>
            <AnimatedHeartIcon isLiked={liked} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LikeButton;
