import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, StyleSheet, Dimensions } from 'react-native';
import PostItem from './post-item';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const ITEM_HEIGHT = Dimensions.get('window').height * 0.6; // Adjust this value based on the height of your PostItem component

const PostsList = ({ posts, currentUserId, handleLovePress, onEditPost, onDeletePost, initialPostindex,header }) => {
  const flatListRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);

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

  useEffect(() => {
    if (initialPostindex != null) {
      const offset = ITEM_HEIGHT * initialPostindex;
      setScrollOffset(offset);
    }
  }, [initialPostindex, sortedPosts]);

  useEffect(() => {
    if (flatListRef.current && scrollOffset != null) {
      flatListRef.current.scrollToOffset({ offset: scrollOffset, animated: true });
    }
  }, [scrollOffset]);

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <FlatList
      ListHeaderComponent={header}
      ref={flatListRef}
      data={sortedPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.postId} // Ensure item.postId is unique
      contentContainerStyle={{ paddingBottom: 30, backgroundColor: "#121212" }}
      ListFooterComponent={
        <Text style={styles.endOfPostsText}>No Posts</Text>
      }
      getItemLayout={getItemLayout}
      onScrollToIndexFailed={(info) => {
        // Handle the case when scrolling to index fails
        console.log('Scroll to index failed', info);
      }}
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
