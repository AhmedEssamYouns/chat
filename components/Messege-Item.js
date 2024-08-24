import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FIREBASE_AUTH } from '../firebase/config';

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true, // 12-hour format
  });
};

const MessageItem = ({ item, searchQuery, onLongPressMessage }) => {
  const lowerCaseText = item.text.toLowerCase();
  const lowerCaseSearchQuery = searchQuery.toLowerCase();

  const matchIndex = lowerCaseText.indexOf(lowerCaseSearchQuery);

  const isSentByCurrentUser = item.senderId === FIREBASE_AUTH.currentUser.uid;

  const messageStyle = isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage;

  const handleLongPress = () => {
    if (isSentByCurrentUser) {
      onLongPressMessage(item);
    }
  };

  return (
    <Pressable
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        styles.messageContainer,
        messageStyle,
        isSentByCurrentUser && pressed && styles.pressedMessage // Apply pressed style only if message is sent by the current user
      ]}
    >
      <View>
        {matchIndex !== -1 && searchQuery !== '' ? (
          <Text style={styles.messageText}>
            {item.text.substring(0, matchIndex)}
            <Text style={styles.highlightedText}>
              {item.text.substring(matchIndex, matchIndex + searchQuery.length)}
            </Text>
            {item.text.substring(matchIndex + searchQuery.length)}
          </Text>
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
          <Text style={styles.messageTime}>{formatTimestamp(item.timestamp)}</Text>
          {item.isEdited && (
            <Text style={styles.editedTag}>Edited</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
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
  pressedMessage: {
    opacity: 0.7, // Example of style change when pressed
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  highlightedText: {
    color: 'yellow',
    fontWeight: 'bold',
  },
  messageTime: {
    color: '#BBBBBB',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  editedTag: {
    color: '#BBBBBB',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
});

export default MessageItem;
