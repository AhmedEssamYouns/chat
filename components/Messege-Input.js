import React, { useState, forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Text, Button } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { sendMessage } from '../firebase/manage-Chat-room';
const MessageInput = forwardRef(({ newMessage, setNewMessage, handleSend, isEditing, friendId }, ref) => {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const compressImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // Resize to a smaller width
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Adjust quality
    );
    return manipResult.uri;
  };
  // Function to pick an image from the device
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setImage(compressedUri);
      setModalVisible(true); // Show the modal with the selected image
    }
  };
  // Function to handle sending the message and image
  const handleSendWithImage = () => {
    handleSend();
    sendMessage(friendId, '', image);

    setModalVisible(false); // Close the modal after sending
    setImage(null); // Clear the selected image
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <FontAwesome name="image" size={20} color="tomato" />
        </TouchableOpacity>
        <TextInput
          ref={ref}
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={isEditing ? 'Edit your message' : 'Type a message'}
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity onPress={handleSend}>
          <Ionicons
            name={isEditing ? 'checkmark-circle' : 'send'}
            size={isEditing ? 30 : 20}
            style={styles.sendIcon}
            color="tomato"
          />
        </TouchableOpacity>
      </View>

      {/* Modal to display selected image, input, and send button */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: image }} style={styles.modalImage} />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendWithImage}>
              <Text style={styles.sendButtonText}>{isEditing ? 'Update' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    padding: 10,
    minHeight: 50,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#222',
  },
  sendIcon: {
    marginLeft: 10,
  },
  imagePicker: {
    height: 50,
    paddingLeft: 20,
    paddingRight: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: '#222'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalInput: {
    width: '100%',
    color: '#FFFFFF',
    padding: 10,
    minHeight: 50,
    borderRadius: 25,
    backgroundColor: '#222',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sendButton: {
    backgroundColor: 'tomato',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default MessageInput;
