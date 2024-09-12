import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import PostItem from './post-item';
import { LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can choose a different icon set if preferred

LogBox.ignoreAllLogs();

const ITEM_HEIGHT = 450;

const PostsList = ({ posts, currentUserId, handleLovePress, onEditPost, onDeletePost, initialPostindex, header }) => {
  const flatListRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const hasMounted = useRef(false); 

  // Sort posts by newest first
  const sortedPosts = [...posts].sort((a, b) => {
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);
    return timeB - timeA;
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

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const scrollToIndex = () => {
    if (flatListRef.current && initialPostindex != null) {
      flatListRef.current.scrollToIndex({
        index: initialPostindex,
        animated: true,
      });
    }
  };

  // Scroll to the initial index only on first content load
  const handleContentChange = () => {
    if (!hasMounted.current && sortedPosts.length > 0 && initialPostindex != null) {
      scrollToIndex();
      hasMounted.current = true; // Mark as mounted after first scroll
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 100); // Show button if scrolled more than 100 pixels from the top
  };

  return (
    <View style={styles.container}>
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
        onScroll={handleScroll}
        onContentSizeChange={handleContentChange} // Trigger scroll when content is laid out
        onScrollToIndexFailed={(info) => {
          // Handle failure by scrolling to an approximate offset
          flatListRef.current.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />
      {showButton && (
        <TouchableOpacity style={styles.scrollButton} onPress={scrollToTop}>
          <Icon name="arrow-upward" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  endOfPostsText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: 'gray',
  },
  scrollButton: {
    position: 'absolute',
    top: 20,
    left: 25,
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderRadius: 30, // Circular button
    padding: 10,
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default PostsList;
