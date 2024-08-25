import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import PostItem from './post-item';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(
  
)
const PostsList = ({ posts, currentUserId, handleLovePress, onEditPost, onDeletePost }) => {
  const sortedPosts = [...posts].sort((a, b) => {
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);
    return timeB - timeA; // Newest posts first
  });

  const renderItem = ({ item }) => (
    <PostItem
      item={item}
      currentUserId={currentUserId}
      handleLovePress={handleLovePress}
      onEdit={onEditPost}
      onDelete={onDeletePost}
    />
  );

  return (
    <FlatList
      data={sortedPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.postId} // Ensure item.postId is unique
      contentContainerStyle={{ paddingBottom: 30, backgroundColor: "#121212" }}
      ListFooterComponent={
        <Text style={styles.endOfPostsText}>No Posts</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  endOfPostsText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default PostsList;
