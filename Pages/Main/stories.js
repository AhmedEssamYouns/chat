import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import PostsList from '../../Components/posts-list';
const fakeStories = [
  {
    id: 1,
    name: 'John Doe',
    storyTitle: 'A Day in the Life',
    time: '2 hours ago',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    photo: 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/02/walter-white-and-gustavo-fring-from-breaking-bad.jpg',
    likes: 24,
  },
  {
    id: '2',
    name: 'Jane Smith',
    storyTitle: 'My Recent Adventure',
    time: '5 hours ago',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    photo: 'https://th.bing.com/th/id/R.cc67221625fef9a0e24e8d11983f5ee6?rik=zEuncD36oI8jOg&riu=http%3a%2f%2fimages4.fanpop.com%2fimage%2fphotos%2f24400000%2fHarry-Potter-Wallpaper-harry-potter-24478567-1024-768.jpg&ehk=oxjB0bRikxQT0QZz7qjisSBCXyZgJs6tAUplA0maSJQ%3d&risl=&pid=ImgRaw&r=0',
    likes: 35,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    storyTitle: 'New Recipe Try',
    time: '1 day ago',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    photo: 'https://miro.medium.com/max/4192/1*yj9_ugyJn6XQ5Da9IqCXyg.jpeg',
    likes: 42,
  },
];

const StoriesScreen = () => {

  const currentUserId = 1;

  const handleLovePress = (postId) => {
    // Handle like logic here
    console.log('Loved post with ID:', postId);
  };

  const handleEditPost = (postId) => {
    // Handle post editing logic here
    console.log('Edit post with ID:', postId);
  };

  const handleDeletePost = (postId) => {
    // Handle post deletion logic here
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <View style={{ flex: 1 }}>
      <PostsList
        posts={fakeStories}
        currentUserId={currentUserId}
        handleLovePress={handleLovePress}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  storyItem: {
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  storyContent: {
    flex: 1,
  },
  storyName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  storyTitle: {
    fontSize: 14,
    color: '#DDDDDD',
  },
  storyTime: {
    position: "absolute",
    right: 10,
    top: 25,
    color: '#BBBBBB',
    fontSize: 12,
  },
  storyPhoto: {
    width: '100%',
    resizeMode: 'contain',
    height: 200,
    borderWidth: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  loveSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loveIcon: {
    marginRight: 5,
  },
  likesCount: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  storyList: {
    backgroundColor: '#121212',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff6347',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imagePickerButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  imagePickerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 150,
    marginBottom: 15,
    borderRadius: 10,
  },
  endOfPostsText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default StoriesScreen;
