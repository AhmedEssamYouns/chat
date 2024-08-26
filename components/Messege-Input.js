import React, { useState, forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const MessageInput = forwardRef(({ newMessage, setNewMessage, handleSend, isEditing }, ref) => {
  const [image, setImage] = useState(null);
  // Function to pick an image from the device
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      // You can also handle the image upload here if needed
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <FontAwesome name="image" size={20} color="tomato" />
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}
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
    minHeight:50,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: '#222',
  },
  sendIcon: {
    marginLeft: 10,
  },
  imagePicker: {
    height:50,
    paddingLeft: 20,
    paddingRight:10,
    alignSelf:'center',
    justifyContent:'center',
    borderTopLeftRadius:25,
    borderBottomLeftRadius:25,
    backgroundColor: '#222'
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default MessageInput;
