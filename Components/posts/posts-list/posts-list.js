import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import PostItem from './post-item';
import { LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

LogBox.ignoreAllLogs();

const ITEM_HEIGHT = 550;

const PostsList = ({ posts, currentUserId, handleLovePress, onEditPost, onDeletePost, initialPostindex, header }) => {
  const flatListRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const hasMounted = useRef(false); 

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

  const handleContentChange = () => {
    if (!hasMounted.current && sortedPosts.length > 0 && initialPostindex != null) {
      scrollToIndex();
      hasMounted.current = true; 
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 100); 
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={header}
        ref={flatListRef}
        data={sortedPosts}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.postId + index} 

        contentContainerStyle={{ paddingBottom: 30, backgroundColor: "#121212" }}
        ListFooterComponent={
          <Text style={styles.endOfPostsText}>No Posts</Text>
        }
        getItemLayout={getItemLayout}
        onScroll={handleScroll}
        onContentSizeChange={handleContentChange} 
        onScrollToIndexFailed={(info) => {
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
    borderRadius: 30, 
    padding: 10,
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default PostsList;
