import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const fakeStories = [
  {
    id: '1',
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

  
  const [modalVisible, setModalVisible] = useState(false);
  const [newStory, setNewStory] = useState({ photo: '', caption: '' });
  const [image, setImage] = useState(null);

  const handleLovePress = (storyId) => {
    console.log(`Story ${storyId} loved!`);
  };

  const handleAddPost = () => {
    console.log('New post added:', newStory);
    setModalVisible(false);
    setNewStory({ photo: '', caption: '' });
    setImage(null);
  };

  const handleOutsidePress = () => {
    setModalVisible(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      setNewStory((prev) => ({ ...prev, photo: result.uri }));
    }
  };

  const renderStoryItem = ({ item }) => (
    <View style={styles.storyItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 15 }}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.storyName}>{item.name}</Text>
      </View>
      <Text style={styles.storyTime}>{item.time}</Text>
      <View style={styles.storyContent}>
        <Text style={styles.storyTitle}>{item.storyTitle}</Text>
        <Image source={{ uri: item.photo }} style={styles.storyPhoto} />
        <View style={styles.loveSection}>
          <TouchableOpacity onPress={() => handleLovePress(item.id)} style={styles.loveIcon}>
            <AntDesign name="hearto" size={20} color="tomato" />
          </TouchableOpacity>
          <Text style={styles.likesCount}>{item.likes}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={fakeStories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        style={styles.storyList}
      />

      {/* Floating Action Button */}
      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity> */}

      {/* Modal for adding a new post */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleOutsidePress}
      >
        <Pressable style={styles.modalContainer} onPress={handleOutsidePress}>
          <View style={styles.modalContent} onTouchStart={(e) => e.stopPropagation()}>
            <TouchableOpacity style={styles.closeButton} onPress={handleOutsidePress}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add a New Post</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerButtonText}>Choose Image</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <TextInput
              style={styles.input}
              placeholder="Caption (optional)"
              placeholderTextColor="#AAAAAA"
              value={newStory.caption}
              onChangeText={(text) => setNewStory((prev) => ({ ...prev, caption: text }))}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddPost}>
              <Text style={styles.addButtonText}>Add Post</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    height: 200,
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
    paddingBottom: 100,
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
});

export default StoriesScreen;
