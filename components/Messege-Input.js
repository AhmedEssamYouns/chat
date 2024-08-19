// components/MessageInput.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageInput = ({ newMessage, setNewMessage, handleSend }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        multiline
        style={styles.input}
        placeholder="Type a message"
        placeholderTextColor="#AAAAAA"
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <TouchableOpacity onPress={handleSend}>
        <Ionicons name="send" size={24} color="tomato" style={styles.sendIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#333',
  },
  sendIcon: {
    marginLeft: 10,
  },
});

export default MessageInput;
