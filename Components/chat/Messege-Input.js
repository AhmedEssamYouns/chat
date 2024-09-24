import React, { useState, forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Image, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { sendMessage } from '../../firebase/manage-Chat-room';
import ImagePickerComponent from '../elements/image-picker';

const MessageInput = forwardRef(({ newMessage, setNewMessage, handleSend, isEditing, friendId }, ref) => {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

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

      {/* Image Picker Modal */}
      <ImagePickerComponent
        isVisible={imagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        onImagePicked={(selectedImage) => {
          setImage(selectedImage);
          setModalVisible(true);
        }}
      />

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
    backgroundColor:'transparent',
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
  modalContainer: {
    width: '90%',
    backgroundColor: '#222',
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
