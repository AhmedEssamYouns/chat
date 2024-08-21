// components/PostsList.js
import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import PostItem from './post-item';

const PostsList = ({ posts, currentUserId, handleLovePress, onEditPost, onDeletePost }) => {
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
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 30,backgroundColor:"#121212" }}
      ListFooterComponent={
        <Text style={styles.endOfPostsText}>No More Posts</Text>
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
