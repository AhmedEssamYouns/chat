import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, StyleSheet, Dimensions, View, TouchableOpacity, Animated } from 'react-native';
import PostItem from './post-item';
import { LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can choose a different icon set if preferred

LogBox.ignoreAllLogs();

const ITEM_HEIGHT = Dimensions.get('screen').height * 0.55; // Adjust this value based on the height of your PostItem component

const PostsList = ({ posts, currentUserId, handleLovePress, onEditPost, onDeletePost, initialPostindex, header }) => {
  const flatListRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showButton, setShowButton] = useState(false);

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
        onScrollToIndexFailed={(info) => {
          // Handle the case when scrolling to index fails
          console.log('Scroll to index failed', info);
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
    bottom: 30,
    right: 25,
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
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
