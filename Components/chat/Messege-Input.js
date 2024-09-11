import React, { useState, forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Modal, Text, Pressable } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { sendMessage } from '../../firebase/manage-Chat-room';

const MessageInput = forwardRef(({ newMessage, setNewMessage, handleSend, isEditing, friendId }, ref) => {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  const compressImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setImage(compressedUri);
      setModalVisible(true);
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setImage(compressedUri);
      setModalVisible(true);
    }
  };

  const handleSendWithImage = () => {
    handleSend();
    sendMessage(friendId, '', image);
    setModalVisible(false);
    setImage(null);
  };

  const pickImage = () => {
    setImagePickerVisible(true);
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

      {/* Image Picker Alert Modal */}
      <Modal
        transparent={true}
        visible={imagePickerVisible}
        animationType="fade"
        onRequestClose={() => setImagePickerVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setImagePickerVisible(false)}>
          <Pressable style={styles.alertContainer}>
            <View style={styles.alertButtons}>
            <TouchableOpacity onPress={openImageLibrary} style={styles.alertButton}>
                <FontAwesome name="image" size={30} color="tomato" />
                <Text style={styles.alertButtonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openCamera} style={styles.alertButton}>
                <Ionicons name="camera" size={30} color="tomato" />
                <Text style={styles.alertButtonText}>Camera</Text>
              </TouchableOpacity>
         
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal to display selected image and send button */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
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
        </Pressable>
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
    backgroundColor: '#222',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: 250,
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  alertButton: {
    alignItems: 'center',
    padding: 10,
  },
  alertButtonText: {
    marginTop: 5,
    fontSize: 16,
    color: '#fff',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
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
