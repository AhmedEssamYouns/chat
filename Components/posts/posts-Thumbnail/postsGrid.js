import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { fetchUserPostsRealtime } from '../../../firebase/fetchPosts';
import PostCard from './postCard';

const PostGrid = ({ userId, onPostSelect, header }) => {
    const [postImages, setPostImages] = useState([]);

    useEffect(() => {
        const unsubscribe = fetchUserPostsRealtime(userId, (images) => {
            setPostImages(images);
        });

        return () => unsubscribe();
    }, [userId]);

    const handlePostPress = (index) => {
        if (onPostSelect) {
            onPostSelect(index);
        }
    };

    return (
        <View style={styles.grid}>
            {postImages.length > 0 ? (
                <FlatList
                    ListHeaderComponent={header}
                    data={postImages}
                    renderItem={({ item, index }) => (
                        <PostCard
                            imageUrl={item}
                            onPress={() => handlePostPress(index)}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.gridContent}
                />
            ) : (
                <Text style={styles.noSnapsText}>No snaps yet</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flex: 1,
        top: 5,
        alignSelf: 'center',
    },
    gridContent: {
        alignItems: 'flex-start',
    },
    noSnapsText: {
        color: '#bbb',
        fontFamily: 'title',
        textAlign: 'center',
        marginTop: 20, 
        fontSize: 16, 
    },
});

export default PostGrid;
