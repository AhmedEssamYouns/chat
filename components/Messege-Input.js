
import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const MessageInput = forwardRef(({ newMessage, setNewMessage, handleSend, isEditing }, ref) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={ref}
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder={isEditing ? 'Edit your message' : 'Type a message'}
        placeholderTextColor="#999"
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
    borderRadius: 25,
    backgroundColor: '#222',
  },
  sendIcon: {
    marginLeft: 10,
  },
});

export default MessageInput;
