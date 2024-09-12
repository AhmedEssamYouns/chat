import React, { useState } from 'react';
import { Modal, Pressable, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ isVisible, onClose, onImagePicked }) => {
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
      onImagePicked(compressedUri);
      onClose();
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
      onImagePicked(compressedUri);
      onClose();
    }
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
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
  );
};

const styles = StyleSheet.create({
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
});

export default ImagePickerComponent;
