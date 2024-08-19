import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons

const ChatConversationScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey, how are you?',
      time: '12:34 PM',
      isSentByMe: false,
    },
    {
      id: '2',
      text: 'I’m good! How about you?',
      time: '12:36 PM',
      isSentByMe: true,
    },
    {
      id: '3',
      text: 'Doing well, thanks!',
      time: '12:37 PM',
      isSentByMe: false,
    },
    // Add more messages here
  ]);

  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() !== '') {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: (prevMessages.length + 1).toString(),
          text: newMessage,
          time: 'Now',
          isSentByMe: true,
        },
      ]);
      setNewMessage('');
    }
  };

  const renderMessageItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSentByMe ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <FlatList
        ref={flatListRef}
        data={messages.reverse()} // No need to reverse here
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20,paddingBottom:20 }}
        style={styles.messageList}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
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
    </View>
  );
};

const styles = StyleSheet.create({
  messageList: {
    backgroundColor: '#121212',
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#A8342A',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#333333',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  messageTime: {
    color: '#BBBBBB',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
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

export default ChatConversationScreen;
