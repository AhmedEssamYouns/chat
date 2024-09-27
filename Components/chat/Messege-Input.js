import React, { useState, forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Image, Text, Pressable, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { sendMessage } from '../../firebase/manage-Chat-room';
import ImagePickerComponent from '../elements/image-picker';

const MessageInput = forwardRef(({ newMessage, setNewMessage, handleSend, isEditing, friendId }, ref) => {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  // Function to start audio recording
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        console.log('Permission to access microphone denied');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Function to stop audio recording
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
      setModalVisible(true); // Open modal to send or cancel
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleSendWithAudio = () => {
    handleSend();
    sendMessage(friendId, '', null, audioUri); // Sending audio message
    setModalVisible(false);
    setAudioUri(null);
  };

  const handleSendWithImage = () => {
    handleSend();
    sendMessage(friendId, '', image); // Sending image message
    setModalVisible(false);
    setImage(null);
  };

  const pickImage = () => {
    setImagePickerVisible(true);
  };

  return (
    <>
      <View style={styles.inputContainer}>
        {/* Image Picker Button */}

        <View
          style={styles.input}
        >
          {!newMessage && < FontAwesome  style={{
            padding:5
          }} onPress={pickImage} name="image" size={20} color="tomato" />}

          <TextInput
            ref={ref}
            value={newMessage}
            style={{ color: "white", width: newMessage ? '90%' : '78%', paddingHorizontal: 10, }}
            onChangeText={setNewMessage}
            placeholder={isEditing ? 'Edit your message' : 'Type a message'}
            placeholderTextColor="#999"
            multiline
          />
          {!newMessage && <FontAwesome style={{
            padding: 5
          }} onPress={recording ? stopRecording : startRecording} name={recording ? "stop-circle" : "microphone"} size={24} color="tomato" />}
          {newMessage &&
            <TouchableOpacity>
              <Ionicons
                onPress={handleSend}
                name={isEditing ? 'checkmark-circle' : 'send'}
                size={isEditing ? 30 : 20}
                style={styles.sendIcon}
                color="tomato"
              />
            </TouchableOpacity>}

        </View>
        {/* Send Message Button */}

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

      {/* Modal for sending image or audio */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Conditionally render Image or Audio info */}
            {image ? (
              <Image source={{ uri: image }} style={styles.modalImage} />
            ) : audioUri ? (
              <Text style={styles.audioText}>Audio Recorded</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={image ? handleSendWithImage : handleSendWithAudio}
              >
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
    backgroundColor: 'transparent',
    padding: 10,
    paddingHorizontal: 15,
  },
  input: {
    flexDirection: "row",
    maxHeight: 200,
    width: '100%',
    alignItems: 'center',
    color: '#FFFFFF',
    padding: 10,
    gap: 5,
    minHeight: 55,
    borderRadius: 30,
    backgroundColor: '#222',
  },
  sendIcon: {
    padding: 5
  },
  recordButton: {
    height: 50,
    paddingLeft: 20,
    paddingRight: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: '#222',
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
  audioText: {
    color: '#FFFFFF',
    fontSize: 18,
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
